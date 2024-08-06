// Installed Utils
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// App Utils
import i18n from '../i18n.config';

// User Schema
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, i18n.__('email_is_required')],
        unique: true,
    },
    password: {
        type: String,
        required: [true, i18n.__('password_is_required')],
    },
    social_id: {
        type: Number
    },
},
{
    timestamps: true,
});

// Pre-save middleware to hash the password before saving the user
userSchema.pre('save', async function(next) {
    try {
        // Check if the password is modified
        if (!this.isModified('password')) {
            return next();
        }

        // Generate a salt
        const salt = await bcrypt.genSalt(10);
        // Hash the password using the generated salt
        const hashedPassword = await bcrypt.hash(this.password, salt);
        // Set the hashed password on the user document
        this.password = hashedPassword;

        next();
    } catch (err) {
        console.log(err);
        next();
    }
});

// Pre-save middleware to hash the password before updating the user
userSchema.pre('findOneAndUpdate', async function(next) {
    try {
      const update = this.getUpdate();
  
      // Ensure the update object is of type UpdateQuery
      if (update && typeof update === 'object' && !Array.isArray(update)) {
        if (update.$set && update.$set.password) {
          // Generate a salt
          const salt = await bcrypt.genSalt(10);
          // Hash the new password using the generated salt
          const hashedPassword = await bcrypt.hash(update.$set.password, salt);
          // Set the hashed password on the update object
          update.$set.password = hashedPassword;
        }
  
        // Automatically update the updatedAt field
        if (!update.$set) {
          update.$set = {};
        }
        update.$set.updatedAt = new Date();
      }
  
      next();
    } catch (err) {
      console.log(err);
      // Pass the error to the next middleware
      next();
    }
});

// Export User Schema
export default mongoose.model('User', userSchema);