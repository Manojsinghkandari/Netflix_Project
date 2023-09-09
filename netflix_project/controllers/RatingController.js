const UserRating = require("../models/RatingModel");
const User = require("../models/UserModel");

const addRating = async (req, res) => {
  let { contentId, rating, review } = req.body;
  //   if (!review) {
  //     review = "";
  //   }
  try {
    // get userId from email from token
    const email = req.user.email;
    let user = await User.findOne({ email: email });
    const userId = user._id;
    const newRating = new UserRating({
      contentId,
      userId,
      rating,
      review,
    });
    await newRating.save();
    res.status(200).send("Rating added successfully");
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

const updateRating = async (req, res) => {
  //  movie --> xyz user --> abc
  // movie xyz user abc can only have one record
  try {
    //    find the user ID
    const { contentId, rating } = req.body;
    const email = req.user.email;
    let user = await User.findOne({ email: email });
    const userId = user._id;

    // 1. find the record
    const record = await UserRating.findOne({ contentId, userId });
    // 2. check for the record

    if (record) {
      await UserRating.findByIdAndUpdate(record._id, { rating: rating });
      res.send("Record updated successfully");
    } else {
      const newRating = new UserRating({
        contentId,
        userId,
        rating,
      });
      await newRating.save();
      res.send("Record created successfully");
    }
  } catch (err) {
    console.log(err);
    res.send(err);
  }

  // 3. if exists update else create
};

const deleteRating = async (req, res) => {
  const { contentId } = req.body;
  try {
    const email = req.user.email;
    const user = await User.findOne({ email: email });
    const userId = user._id;
    await UserRating.findOneAndDelete({ contentId, userId });
    res.send("Rating deleted successfully");
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};

// create a function to get all the ratings of a particular content
const getRatingsOfAContent = async (req, res) => {
  const { contentId } = req.query;
  try {
    let content = await UserRating.find({ contentId: contentId });
    res.status(200).send(content);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

// create a function to get all the ratings of a particular users
const getRatingsOfAUser = async (req, res) => {
  const { userId } = req.query;

  try {
    let user = await UserRating.find({ userId: userId });
    // let userData = await User.find({ _id: userId });
    // // user.name =
    // //   userData[0].profileInformation.firstName +
    // //   " " +
    // //   userData[0].profileInformation.lastName;
    res.status(200).send(user);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

// create a function that recommends a movie based on the ratings of the user 

const recommendMovie = async (req, res) => {   try {     
  // Fetched the user ID from the email     
  let user = await User.findOne({ email: req.user.email }).lean();     
  let userId = user._id;    
   // Fetched all the content and ratings     
   let allContent = await Content.find({}).lean();     
   let allRatings = await UserRating.find({ userId }).lean();     
   let allGenres = [];     
   // Fetched all the genres from the movies     
   allGenres = allContent.map((content) => content.genre);     
   // Removed the duplicates     
   allGenres = [...new Set(allGenres)];     
   // allGenres = new Set(allGenres); 
   // converting array to set     
   // allGenres = [...allGenres]; // converting set to array      
   // if movies are rated 4 or 5 then I will + 1     
   // if movies are rated 3 then I will add 0     
   // if movies are rated 1 or 2 then I will - 1     
   // if movies are not rated then I will add 0     
   let allRatingsOfUser = {};    
    allContent.forEach((content) => {       
      let genre = content.genre;       
      let rating = 0;      
       let ratingObject = allRatings.find((rating) =>        
        rating.contentId.equals(content._id)      
         );      
          if (!ratingObject) {         
            rating = 3;       
          } else {        
             rating = ratingObject.rating;       
            }       
            if (Object.keys(allRatingsOfUser).includes(genre)) {         
              if (rating >= 4) {           
                allRatingsOfUser[genre] += 1;        
               } else if (rating >= 3) {          
                 allRatingsOfUser[genre] += 0;        
                 } else {           
                  allRatingsOfUser[genre] -= 1;        
                 }       
                } else {         
                  if (rating >= 4) {           
                    allRatingsOfUser[genre] = 1;       
                    } else if (rating >= 3) {          
                       allRatingsOfUser[genre] = 0;        
                       } else {          
                         allRatingsOfUser[genre] = -1;         
                        }       
                      }     
                    });     
                     // filter allRatingsofUser to sort the allContent based on the ratings      
                     // sort allRatingsOfUser based on the values     
                     let sortedRatings = Object.keys(allRatingsOfUser).sort((a, b) => {      
                       return allRatingsOfUser[b] - allRatingsOfUser[a];    
                       });    
                        // res.send({ sortedRatings, allRatingsOfUser });     
                        let finalMovies = [];     
                        console.log(allRatingsOfUser);    
                         sortedRatings.forEach((rating) => {      
                           let genre = rating;       
                           let movies = allContent.filter((content) => content.genre === genre);       
                           finalMovies = [...finalMovies, ...movies];     
                          });    
                           res.send(finalMovies);   
                          } catch (err) {     
                            console.log(err);     
                            res.send(err);   
                          } };  





                          const topRatedContent = async (req, res) => {   
                            try {    
                               let allRatings = await UserRating.find({}).lean();     
                               let allContent = await Content.find({}).lean();     
                                // res.send({ allContent, allRatings });    
                                 let allUserRatings = {};    
                                  // allUserRatings = { contentId: [3,4,5,1]    
                                   allRatings.forEach((rating) => {       
                                    let contentId = rating.contentId;      
                                     let ratings = rating.rating;      
                                      if (Object.keys(allUserRatings).includes(contentId.toString())) {        
                                         allUserRatings[contentId].push(ratings);      
                                         } else {        
                                           allUserRatings[contentId] = [ratings];       
                                          }     
                                        });     
                                        allUserRatings = Object.keys(allUserRatings).map((contentId) => {      
                                           let ratings = allUserRatings[contentId];       
                                           let sum = 0;      
                                            ratings.forEach((rating) => {         
                                              sum += rating;       
                                            });      
                                             return {        
                                               contentId,         
                                               averageRating: sum / ratings.length,       
                                              };     
                                            });    
                                             allUserRatings.sort((a, b) => {       
                                              return b.averageRating - a.averageRating;     
                                            });    
                                             let finalMovies = [];    
                                              allUserRatings.forEach((rating) => {      
                                                 let contentId = rating.contentId;      
                                                  let movie = allContent.find((content) => content._id.equals(contentId));      
                                                   finalMovies.push(movie);     
                                                  });     
                                                  res.send(finalMovies);   
                                                } catch (err) {     
                                                  console.log(err);     
                                                  res.send(err);   } };

  

module.exports = {
  addRating,
  updateRating,
  deleteRating,
  getRatingsOfAContent,
  getRatingsOfAUser,
  recommendMovie,
  topRatedContent
};
