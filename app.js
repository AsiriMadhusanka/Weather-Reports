const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
const axios = require('axios');
const { sendWeatherReportEmail } = require('./emailSender');
require('dotenv').config();



const User = require('./models/User');

const app = express();

app.use(bodyParser.json());

const userSchema = buildSchema(`
  type User {
    _id: ID!
    email: String!
    location: String!
    date: String!
    weatherData: WeatherData
  }

  input UserInput {
    email: String!
    location: String!
    date: String!
  }

  input UserUpdateInput {
    _id: ID!
    location: String!
  }

  type WeatherData {
    coord: Coord
    weather: [Weather]
    base: String
    main: Main
    visibility: Int
    wind: Wind
    clouds: Clouds
    dt: Int
    sys: Sys
    timezone: Int
    id: Int
    name: String
    cod: Int
  }

  type Coord {
    lon: Float
    lat: Float
  }

  type Weather {
    id: Int
    main: String
    description: String
    icon: String
  }

  type Main {
    temp: Float
    feels_like: Float
    temp_min: Float
    temp_max: Float
    pressure: Int
    humidity: Int
  }

  type Wind {
    speed: Float
    deg: Int
  }

  type Clouds {
    all: Int
  }

  type Sys {
    type: Int
    id: Int
    message: Float
    country: String
    sunrise: Int
    sunset: Int
  }

  type RootQuery {
    users: [User!]!
  }

  type RootMutation {
    createUser(userInput: UserInput): User
    updateUser(userUpdateInput: UserUpdateInput): User
  }

  schema {
    query: RootQuery
    mutation: RootMutation
  }
`);

const rootValue = {
  users: () => {
    return User.find()
      .then(users => {
        return users.map(user => {
          return { ...user._doc, _id: user._id.toString() };
        });
      })
      .catch(err => {
        throw err;
      });
  },
  createUser: (args) => {
    const user = new User({
      email: args.userInput.email,
      location: args.userInput.location,
      date: new Date(args.userInput.date)
    });
    return user
      .save()
      .then(result => {
        console.log(result);
        return { ...user._doc, _id: result._doc._id.toString() };
      })
      .catch(err => {
        console.log(err);
        throw err;
      });
  },
// ...

updateUser: async (args) => {
    const { _id, location } = args.userUpdateInput;
  
    try {
      // Get the user record to update
      const updatedUser = await User.findById(_id);
  
      if (!updatedUser) {
        throw new Error('User not found');
      }
  
      // Update the user location
      updatedUser.location = location;
  
      // Fetch weather data from OpenWeatherMap API
      const apiKey = 'b5c72e42ffdd04820c933003958855e6';
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&appid=${process.env.API_KEY}`;
  
      const weatherResponse = await axios.get(url);
      const weatherData = weatherResponse.data;
  
      // Update the user record with weather data
      updatedUser.weatherData = weatherData;
  
      // Save the updated user record
      const savedUser = await updatedUser.save();
  
      // Send weather report via email
      sendWeatherReportEmail(updatedUser.email, location, weatherData.weather[0].description);
  
      // Return the updated user record
      return savedUser;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  
  // ...
  
  
};

app.use(
  '/users',
  graphqlHTTP({
    schema: userSchema,
    rootValue: rootValue,
    graphiql: true,
  })
);

mongoose
  .connect(`mongodb+srv://${process.env.MONGO_USER}:${
    process.env.MONGO_PASSWORD
  }@cluster0.tmeaxdn.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`)
  .then(() => {
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });


/********************************************************************************************************************* */




// const express = require('express');
// const bodyParser = require('body-parser');
// const { graphqlHTTP } = require('express-graphql');
// const { buildSchema } = require('graphql');
// const mongoose = require('mongoose');
// const axios = require('axios');


// const User = require('./models/User');

// const app = express();

// app.use(bodyParser.json());

// const userSchema = buildSchema(`
//   type User {
//     _id: ID!
//     email: String!
//     location: String!
//     date: String!
//     weatherData: WeatherData
//   }

//   input UserInput {
//     email: String!
//     location: String!
//     date: String!
//   }

//   input UserUpdateInput {
//     _id: ID!
//     location: String!
//   }

//   type WeatherData {
//     coord: Coord
//     weather: [Weather]
//     base: String
//     main: Main
//     visibility: Int
//     wind: Wind
//     clouds: Clouds
//     dt: Int
//     sys: Sys
//     timezone: Int
//     id: Int
//     name: String
//     cod: Int
//   }

//   type Coord {
//     lon: Float
//     lat: Float
//   }

//   type Weather {
//     id: Int
//     main: String
//     description: String
//     icon: String
//   }

//   type Main {
//     temp: Float
//     feels_like: Float
//     temp_min: Float
//     temp_max: Float
//     pressure: Int
//     humidity: Int
//   }

//   type Wind {
//     speed: Float
//     deg: Int
//   }

//   type Clouds {
//     all: Int
//   }

//   type Sys {
//     type: Int
//     id: Int
//     message: Float
//     country: String
//     sunrise: Int
//     sunset: Int
//   }

//   type RootQuery {
//     users: [User!]!
//   }

//   type RootMutation {
//     createUser(userInput: UserInput): User
//     updateUser(userUpdateInput: UserUpdateInput): User
//   }

//   schema {
//     query: RootQuery
//     mutation: RootMutation
//   }
// `);

// const rootValue = {
//   users: () => {
//     return User.find()
//       .then(users => {
//         return users.map(user => {
//           return { ...user._doc, _id: user._id.toString() };
//         });
//       })
//       .catch(err => {
//         throw err;
//       });
//   },
//   createUser: (args) => {
//     const user = new User({
//       email: args.userInput.email,
//       location: args.userInput.location,
//       date: new Date(args.userInput.date)
//     });
//     return user
//       .save()
//       .then(result => {
//         console.log(result);
//         return { ...user._doc, _id: result._doc._id.toString() };
//       })
//       .catch(err => {
//         console.log(err);
//         throw err;
//       });
//   },
//   updateUser: async (args) => {
//     const { _id, location } = args.userUpdateInput;
  
//     try {
//       // Get the user record to update
//       const updatedUser = await User.findById(_id);
  
//       if (!updatedUser) {
//         throw new Error('User not found');
//       }
  
//       // Update the user location
//       updatedUser.location = location;
  
//       // Fetch weather data from OpenWeatherMap API
//       const apiKey = 'b5c72e42ffdd04820c933003958855e6';
//       const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&appid=${apiKey}`;
  
//       const weatherResponse = await axios.get(url);
//       const weatherData = weatherResponse.data;
  
//       // Update the user record with weather data
//       updatedUser.weatherData = weatherData;
  
//       // Save the updated user record
//       const savedUser = await updatedUser.save();
  
//       // Return the updated user record
//       return savedUser;
//     } catch (err) {
//       console.log(err);
//       throw err;
//     }
//   },
  
// };

// app.use(
//   '/users',
//   graphqlHTTP({
//     schema: userSchema,
//     rootValue: rootValue,
//     graphiql: true,
//   })
// );

// mongoose
//   .connect(`mongodb+srv://${process.env.MONGO_USER}:${
//     process.env.MONGO_PASSWORD
//   }@cluster0.tmeaxdn.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`)
//   .then(() => {
//     app.listen(3000);
//   })
//   .catch(err => {
//     console.log(err);
//   });




/************************************************************************************************************************ */



// const express = require('express');
// const bodyParser = require('body-parser');
// const { graphqlHTTP } = require('express-graphql');
// const { buildSchema } = require('graphql');
// const mongoose = require('mongoose');
// const axios = require('axios');

// const User = require('./models/User');

// const app = express();

// app.use(bodyParser.json());

// const userSchema = buildSchema(`
//   type User {
//     _id: ID!
//     email: String!
//     location: String!
//     date: String!
//   }

//   input UserInput {
//     email: String!
//     location: String!
//     date: String!
//   }

//   input UserUpdateInput {
//     _id: ID!
//     location: String!
//   }

//   type RootQuery {
//     users: [User!]!
//   }

//   type RootMutation {
//     createUser(userInput: UserInput): User
//     updateUser(userUpdateInput: UserUpdateInput): User
//   }

//   schema {
//     query: RootQuery
//     mutation: RootMutation
//   }
// `);

// const rootValue = {
//   users: () => {
//     return User.find()
//       .then(users => {
//         return users.map(user => {
//           return { ...user._doc, _id: user._id.toString() };
//         });
//       })
//       .catch(err => {
//         throw err;
//       });
//   },
//   createUser: (args) => {
//     const user = new User({
//       email: args.userInput.email,
//       location: args.userInput.location,
//       date: new Date(args.userInput.date)
//     });
//     return user
//       .save()
//       .then(result => {
//         console.log(result);
//         return { ...user._doc, _id: result._doc._id.toString() };
//       })
//       .catch(err => {
//         console.log(err);
//         throw err;
//       });
//   },
//   updateUser: (args) => {
//     const { _id, location } = args.userUpdateInput;
  
//     return User.findByIdAndUpdate(_id, { location }, { new: true })
//       .then(updatedUser => {
//         if (!updatedUser) {
//           throw new Error('User not found');
//         }
  
//         // API call to OpenWeatherMap
//         const apiKey = 'b5c72e42ffdd04820c933003958855e6';
//         const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&appid=${apiKey}`;
  
//         return axios.get(url)
//           .then(response => {
//             const weatherData = response.data;
  
//             // Log the weather data to the console
//             console.log(weatherData);
  
//             return updatedUser;
//           })
//           .catch(err => {
//             throw err;
//           });
//       })
//       .catch(err => {
//         throw err;
//       });
//   },
  
  
// };

// app.use(
//   '/users',
//   graphqlHTTP({
//     schema: userSchema,
//     rootValue: rootValue,
//     graphiql: true,
//   })
// );

// mongoose
//   .connect(`mongodb+srv://${process.env.MONGO_USER}:${
//     process.env.MONGO_PASSWORD
//   }@cluster0.tmeaxdn.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`)
//   .then(() => {
//     app.listen(3000);
//   })
//   .catch(err => {
//     console.log(err);
//   });







/******************************************************************************************************************** */

// const express = require('express');
// const bodyParser = require('body-parser');
// const { graphqlHTTP } = require('express-graphql');
// const { buildSchema } = require('graphql');
// const mongoose = require('mongoose');

// const User = require('./models/User');

// const app = express();

// app.use(bodyParser.json());

// const userSchema = buildSchema(`
//   type User {
//     _id: ID!
//     email: String!
//     location: String!
//     date: String!
//   }

//   input UserInput {
//     email: String!
//     location: String!
//     date: String!
//   }

//   input UserUpdateInput {
//     _id: ID!
//     location: String!
//   }

//   type RootQuery {
//     users: [User!]!
//   }

//   type RootMutation {
//     createUser(userInput: UserInput): User
//     updateUser(userUpdateInput: UserUpdateInput): User
//   }

//   schema {
//     query: RootQuery
//     mutation: RootMutation
//   }
// `);

// const rootValue = {
//   users: () => {
//     return User.find()
//       .then(users => {
//         return users.map(user => {
//           return { ...user._doc, _id: user._id.toString() };
//         });
//       })
//       .catch(err => {
//         throw err;
//       });
//   },
//   createUser: (args) => {
//     const user = new User({
//       email: args.userInput.email,
//       location: args.userInput.location,
//       date: new Date(args.userInput.date)
//     });
//     return user
//       .save()
//       .then(result => {
//         console.log(result);
//         return { ...user._doc, _id: result._doc._id.toString() };
//       })
//       .catch(err => {
//         console.log(err);
//         throw err;
//       });
//   },
//   updateUser: (args) => {
//     const { _id, location } = args.userUpdateInput;

//     return User.findByIdAndUpdate(_id, { location }, { new: true })
//       .then(updatedUser => {
//         if (!updatedUser) {
//           throw new Error('User not found');
//         }
//         return updatedUser;
//       })
//       .catch(err => {
//         throw err;
//       });
//   },
// };

// app.use(
//   '/users',
//   graphqlHTTP({
//     schema: userSchema,
//     rootValue: rootValue,
//     graphiql: true,
//   })
// );

// mongoose
//   .connect(`mongodb+srv://${process.env.MONGO_USER}:${
//     process.env.MONGO_PASSWORD
//   }@cluster0.tmeaxdn.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`)
//   .then(() => {
//     app.listen(3000);
//   })
//   .catch(err => {
//     console.log(err);
//   });





/******************************************************************************************************************** */

// const express = require('express');
// const bodyParser = require('body-parser');
// const { graphqlHTTP } = require('express-graphql');
// const { buildSchema } = require('graphql');
// const mongoose = require('mongoose');

// const Event = require ('./models/User');
// const User = require('./models/User');

// const app = express();

// const users = [];

// app.use(bodyParser.json());

// app.use('/users', graphqlHTTP({
//     schema: buildSchema(`
//        type User {
//           _id: ID!
//           email: String!
//           location: String!
//           date: String!
//        }

//        input UserInput {
//           email: String!
//           location: String!
//           date: String!
//        }

//        type RootQuery {
//         users: [User!]!
//        }

//        type RootMutation {
//         createUser(userInput: UserInput): User
//        }
//        schema {
//         query: RootQuery
//         mutation: RootMutation
//     }
// `),
// rootValue: {
//     users: () => {
//         // return events;
//         return User.find()
//         .then(users => {
//             return users.map(user => {
//               return {...user._doc, _id: user._id.toString()}
//             });
//         })
//         .catch(err => {
//             throw err;
//         })
//     },
//     createUser: (args) => {
//         const user = new User ({
//             email: args.userInput.email,
//             location: args.userInput.location,
//             date: new Date (args.userInput.date)
//         });
//         return user
//               .save()
//               .then(result => {
//                 console.log(result)
//                 return {...user._doc, _id: result._doc._id.toString()};
//               })
//               .catch(err => {
//                 console.log(err);
//                 throw err;
//               });
//               return user;
//             }
//         },
//         graphiql: true
//     })
// );

// mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${
//     process.env.MONGO_PASSWORD
// }@cluster0.tmeaxdn.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority` //${process.env.MONGO_DB}
// )
// .then(() => {
//     app.listen(3000);
// })
// .catch(err => {
//    console.log(err)
// });
