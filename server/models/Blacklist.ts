import mongoose, { Document, Schema } from 'mongoose';

interface IBlacklist extends Document {
  token: string;
}

const BlacklistSchema: Schema<IBlacklist> = new Schema(
  {
    token: {
      type: String,
      required: true,
      ref: 'User',
    },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: 'Blacklist',
  }
);

export default mongoose.model<IBlacklist>('Blacklist', BlacklistSchema);
