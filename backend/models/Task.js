const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        minlength: [1, 'Title cannot be empty'],
        maxlength: [100, 'Title cannot exceed 100 characters']
    },
    description: {
        type: String,
        trim: true,
        maxlength: [500, 'Description cannot exceed 500 characters'],
        default: ''
    },
    status: {
        type: String,
        enum: {
            values: ['pending', 'in-progress', 'completed'],
            message: '{VALUE} is not a valid status'
        },
        default: 'pending'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        immutable: true
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

taskSchema.pre('save', function () {
    this.updatedAt = new Date();
});

taskSchema.pre('findOneAndUpdate', function () {
    this.set({ updatedAt: new Date() });
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
