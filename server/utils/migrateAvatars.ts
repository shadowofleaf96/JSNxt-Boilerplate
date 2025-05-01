import mongoose from 'mongoose';
import path from 'path';
import dotenv from 'dotenv';
import User from '../models/Users';

dotenv.config();

const migrateAvatarUrls = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('Connected to database');

    // Find all users with avatars (including empty/null)
    const users = await User.find({});
    console.log(`Found ${users.length} users to process`);

    let migratedCount = 0;
    let skippedCount = 0;
    
    for (const user of users) {
      // Skip if no avatar or already has full URL
      if (!user.avatar || user.avatar.startsWith('http')) {
        skippedCount++;
        continue;
      }

      try {
        const newUrl = `${process.env.BACKEND_URL}/images/${path.basename(user.avatar)}`;
        
        // Method 1: Direct update (faster)
        await User.updateOne(
          { _id: user._id },
          { avatar: newUrl }, // Just update the avatar field
          { runValidators: false } // Temporarily disable validation
        );

        // OR Method 2: Find + Save (safer)
        /*
        const userDoc = await User.findById(user._id);
        if (userDoc) {
          userDoc.avatar = newUrl;
          await userDoc.save({ validateBeforeSave: false });
        }
        */

        migratedCount++;
        console.log(`Migrated user ${user._id}`);
      } catch (err) {
        console.error(`Error migrating user ${user._id}:`, err);
      }
    }

    console.log(`
      Migration complete!
      Total users: ${users.length}
      Migrated: ${migratedCount}
      Skipped: ${skippedCount}
    `);
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

migrateAvatarUrls();