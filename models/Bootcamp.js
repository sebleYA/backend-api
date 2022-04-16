const mongoose = require('mongoose');

// create Bootcamp Schema
const BootcampSchema = new mongoose.Schema({
    name: {
        type: String,
        requir:[ true, 'Please add a name'],
        unique : true,
        trim: true,
        maxlength : [50, 'Name can not be longer than 50 characters']
    },
    sluge: String,
    description:{
        type: String,
        requir:[ true, 'Please add a description'],
        maxlength : [500, 'Description can not be longer than 500 characters']
    },
    website:{
        type: String,
        match: [/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
        'Please use a valid URL with HTTP or HTTPS'    ]
    },
    phone:{
        type: String,
        maxlength : [20, 'Phone number can not be longer than 20 characters']
    },
    email:{
        type: String,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please add a valid email']
    },
    address:{
        type: String,
        require: [true, 'please add an address']
    },
    // location:{
    //     // GeoJNSON Poing
    //     type: {
    //         type: String,
    //         enum: ['Point'],
    //         required: true
    //       },
    //       coordinates: {
    //         type: [Number],
    //         required: true,
    //         index: '2dsphere'
    //       },
    //       formattedAddress: String,
    //       street: String,
    //       city: String,
    //       state: String,
    //       zipcode: String,
    //       country: String,
    // },
    careers:{
        // Array of Strings
        type: [String],
        required: true,
        enums:[
            'Web Development',
            'Mobile Development',
            'UI/UX',
            'Data Science',
            'Business',
            'Others'
        ]
    },
    averageRating:{
        type: Number,
        min: [1, 'Rating must be at least 1'],
        max: [10, 'Rating can not be more than 10']
    },
    averageCost:Number,
    photo:{
        type: String,
        default: 'no-photo'
    },
    housing:{
        type: Boolean,
        default: false
    },
    jobAssistance:{
        type: Boolean,
        default: false
    },
    jobGuarantee:{
        type: Boolean,
        default: false
    },
    acceptGi:{
        type: Boolean,
        default: false
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Bootcamp', BootcampSchema)