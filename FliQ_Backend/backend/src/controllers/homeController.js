// homeController.js

const movieNewsmodel=require('../models/movienewsModel')

const categoryModel=require('../models/CategeoryModel')

const subcategoryModel=require('../models/subcategoryModel');
const titleModel = require('../models/titleModel');
const QuizModel = require('../models/QuizModel');
const movienewsModel = require('../models/movienewsModel');
const sectionModel = require('../models/sectionModel');
const BannerModel = require('../models/BannerModel');


//{
// get home data future enhancemnets
//  future enhancements, Caching → Faster responses
//  Pagination → Load more data dynamically
//  Search & Filtering → Better
// Indexing → Optimize large datasets
//  Real-time updates → WebSockets for live changes}
// exports.gethome = async (req, res) => {
//   try {
//     // this line Fetch latest one for banners
//     const latestMovieNews = await movieNewsmodel
//       .findOne()
//       .sort({ createdAt: -1 })
//       .select(" _id title description imageUrl createdAt");

//     const latestMovieReview = await sectionModel
//       .findOne()
//       .sort({ createdAt: -1 })
//       .select("_id title  imageUrl rating createdAt");

//     const latestCategory = await categoryModel
//       .findOne()
//       .sort({ createdAt: -1 })
//       .select("_id title imageUrl subcategories createdAt");




//     // this lines latest 10 for response
//     const movieNews = await movieNewsmodel
//       .find()
//       .sort({ createdAt: -1 })
//       .limit(10)
//       .select("_id title description images imageUrl createdAt");

//     const movieReviews = await sectionModel
//       .find()
//       .sort({ createdAt: -1 })
//       .limit(10)
//       .select("_id title rating reviewText imageUrl createdAt");

//     const categories = await categoryModel
//       .find()
//       .sort({ createdAt: -1 })
//       .limit(10)
//       .select(" _id title imageUrl  createdAt");

    

//     // Fetch subcategories for each category with images
//     const categoriesWithSubcategories = await Promise.all(
//       categories.map(async (category) => {
//         const subcategories = await subcategoryModel
//           .find({ category: category._id })
//           .select("_id title imageUrl createdAt"); 

//         return { 
//           _id: category._id,
//           title: category.title, 
//           imageUrl: category.imageUrl, subcategories
//          };
//       })
//     );

   
//     const banners = [];
    
//     if (latestMovieNews) banners.push({ type: "movieNews", data: latestMovieNews });
//     if (latestMovieReview) banners.push({ type: "movieReviews", data: latestMovieReview });
//     if (latestCategory) banners.push({ type: "categories", data: latestCategory });

//     const response = [
//       { type: "movieNews", _id: "",data: movieNews },
//       { type: "movieReviews",_id: "", data: movieReviews },
//       ...categoriesWithSubcategories.map(category => ({
//         type: category.title ,
//         _id: category._id,
//         data: category.subcategories 
//       }))
      
//     ];
//     console.log("Categories with Subcategories:", categoriesWithSubcategories);

//     res.json({ banners, response });
//   } catch (error) {
//     console.error("Error fetching homepage data:", error);
//     res.status(500).json({ error: "Failed to load homepage data" });
//   }
// };

exports.gethome = async (req, res) => {
  try {
    // Fetch the latest Movie News for banners, including imageUrl and images
    const latestMovieNews = await movieNewsmodel
      .findOne()
      .sort({ createdAt: -1 })
      .select("_id title description imageUrl images createdAt");  // Make sure to select imageUrl and images

    // Fetch the latest Movie Reviews for banners
    const latestMovieReview = await sectionModel
      .findOne()
      .sort({ createdAt: -1 })
      .select("_id title imageUrl images rating createdAt");

    // Fetch the latest Category for banners
    const latestCategory = await categoryModel
      .findOne()
      .sort({ createdAt: -1 })
      .select("_id title imageUrl images subcategories createdAt");

    // Fetch the latest 10 movie news
    const movieNews = await movieNewsmodel
      .find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select("_id title description images imageUrl createdAt");

    // Fetch the latest 10 movie reviews
    const movieReviews = await sectionModel
      .find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select("_id title rating reviewText imageUrl images createdAt");

    // Fetch the latest 10 categories
    const categories = await categoryModel
      .find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select("_id title imageUrl images createdAt");

    // Fetch subcategories for each category
    const categoriesWithSubcategories = await Promise.all(
      categories.map(async (category) => {
        const subcategories = await subcategoryModel
          .find({ category: category._id })
          .select("_id title imageUrl images createdAt");

        return {
          _id: category._id,
          title: category.title,
          imageUrl: category.imageUrl,
          images: category.images || [],  // Ensure images is an array
          subcategories,
        };
      })
    );

    
const staticmovinews = await BannerModel.findOne({ bannerType: 'MovieNews' }).select('_id title description imageUrl createdAt');
const staticmoviereview = await BannerModel.findOne({ bannerType: 'MovieReviews' }).select('_id title imageUrl createdAt');
const staticcategories = await BannerModel.findOne({ bannerType: 'Categories' }).select('_id title imageUrl createdAt');

const static = [];

if (staticmovinews) static.push({
  type: 'MovieNews',
  data: {
    _id: staticmovinews._id,
    title: staticmovinews.title,
    description: staticmovinews.description,
    imageUrl: staticmovinews.imageUrl || {},
    images: staticmovinews.images || [],  // Ensure images is an array
    createdAt: staticmovinews.createdAt,
  }
});

if (staticmoviereview) static.push({
  type: 'MovieReviews',
  data: {
    _id: staticmoviereview._id,
    title: staticmoviereview.title,
    imageUrl: staticmoviereview.imageUrl || {},
    images: staticmoviereview.images || [],  // Ensure images is an array
    createdAt: staticmoviereview.createdAt,
  }
});

if (staticcategories) static.push({
  type: 'Categories',
  data: {
    _id: staticcategories._id,
    title: staticcategories.title,
    imageUrl: staticcategories.imageUrl || {},
    images: staticcategories.images || [],  // Ensure images is an array
    createdAt: staticcategories.createdAt,
  }
});


    // Set banners with movie news, including imageUrl and images
    const banners = [];
    if (latestMovieNews) banners.push({ 
      type: "News", 
      data: {
        _id: latestMovieNews._id,
        title: latestMovieNews.title,
        description: latestMovieNews.description,
        imageUrl: latestMovieNews.imageUrl || {},  // Ensure imageUrl is an object
        images: latestMovieNews.images || [],     // Ensure images is an array
        createdAt: latestMovieNews.createdAt,
      }
    });

    if (latestMovieReview) banners.push({ 
      type: "Movie Reviews", 
      data: {
        _id: latestMovieReview._id,
        title: latestMovieReview.title,
        description: latestMovieReview.description,
        imageUrl: latestMovieReview.imageUrl || {},  // Ensure imageUrl is an object
        images: latestMovieReview.images || [],     // Ensure images is an array
        createdAt: latestMovieReview.createdAt,
      }
    });
    if (latestCategory) banners.push({ 
      type: "Categories", 
      data: {
        _id: latestCategory._id,
        title: latestCategory.title,
        description: latestCategory.description,
        imageUrl: latestCategory.imageUrl || {},  // Ensure imageUrl is an object
        images: latestCategory.images || [],     // Ensure images is an array
        createdAt: latestCategory.createdAt,
      }
    });
    // Prepare the response with both images[] and imageUrl
    const response = [
      { 
        type: "News", 
        _id: "", 
        data: movieNews.map(news => ({
          ...news.toObject(),
          imageUrl: news.imageUrl || {},  // Default empty object for imageUrl
          images: news.images || []      // Default empty array for images
        }))
      },
      { 
        type: "Movie Reviews", 
        _id: "", 
        data: movieReviews.map(review => ({
          ...review.toObject(),
          imageUrl: review.imageUrl || {},  // Default empty object for imageUrl
          images: review.images || []      // Default empty array for images
        }))
      },
      ...categoriesWithSubcategories.map((category) => ({
        type: category.title,
        _id: category._id,

        data: category.subcategories,
      }))
    ];

    // Log the fetched categories with subcategories for debugging
    console.log("Categories with Subcategories:", categoriesWithSubcategories);

    // Send the response with updated banners and movieNews data
    res.json({ static,banners, response });
  } catch (error) {
    console.error("Error fetching homepage data:", error);
    res.status(500).json({ error: "Failed to load homepage data" });
  }
};




exports.getAllData = async (req, res) => {
  try {
    const { type } = req.query;

    if (!type) {
      return res.status(400).json({ error: "Type parameter is required" });
    }

    // Convert type to lowercase for case insensitivity
    const lowerCaseType = type.toLowerCase();

    let responseData = {};

    // Fetch movie news
    if (lowerCaseType === "news") {
      responseData = {
        type: "News",
     
        data: await movieNewsmodel
          .find()
          .sort({ createdAt: -1 })
          .limit(10)
          .select("_id title description imageUrl createdAt"),
      };
    } 
    
    // Fetch movie reviews
    else if (lowerCaseType === "moviereviews") {
      responseData = {
        type: "movieReviews",
      
        data: await titleModel
          .find()
          .sort({ createdAt: -1 })
          .limit(10)
          .select("_id title imageUrl rating createdAt"),
      };
    } 
    
    // Fetch categories with subcategories
    else {
      // Find category by title (case-insensitive)
      const category = await categoryModel
        .findOne({ title: { $regex: new RegExp(`^${type}$`, "i") } }) // Case-insensitive search
        .select("_id title imageUrl createdAt");

      if (!category) {
        return res.status(404).json({ error: "Invalid type provided" });
      }

      // Fetch subcategories under this category
      const subcategories = await subcategoryModel
        .find({ category: category._id })
        .select("_id title imageUrl createdAt");

      responseData = {
        type: category.title,
        _id: category._id,
        data: subcategories,
      };
    }

    res.json(responseData);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
};





// exports.getAllData = async (req, res) => {
//   try {
//     const { section } = req.query;

//     if (!section) {
//       return res.status(400).json({ error: "Missing section parameter" });
//     }

//     let data = {};

//     if (section.toLowerCase() === "movienews") {
//       data.movieNews = await movieNewsmodel
//         .find()
//         .sort({ createdAt: -1 })
//         .select("title description imageUrl createdAt");
//     } 
//     else if (section.toLowerCase() === "reviews") {
//       data.movieReviews = await titleModel
//         .find()
//         .sort({ createdAt: -1 })
//         .select("title rating reviewText imageUrl createdAt");
//     } 
//     else if (section.toLowerCase() === "categories") {
//       const categories = await categoryModel
//         .find()
//         .sort({ createdAt: -1 })
//         .select("title imageUrl createdAt");

//       const categoriesWithSubcategories = await Promise.all(
//         categories.map(async (category) => {
//           const subcategories = await subcategoryModel
//             .find({ category: category._id })
//             .select("title imageUrl createdAt");

//           return { title: category.title, imageUrl: category.imageUrl, subcategories };
//         })
//       );

//       data.categories = categoriesWithSubcategories;
//     } 
//     else if(section.toLowerCase()==='subcategories'){
//       const subcategories=await subcategoryModel
//       .find().select('title imageUrl createdAt')
          

//       const subcategoriesWithCategory=await Promise.all(
//         subcategories.map(async(subcategory)=>{
//           const category=await categoryModel.findById(subcategory
//             .category)
//             .select('title imageUrl createdAt');

//             return{title:subcategory.title,imageUrl:subcategory.imageUrl,category}    
//           })
//         )
//     }
//     else {
//       return res.status(400).json({ error: "Invalid section provided" });
//     }

//     res.json(data);
//   } catch (error) {
//     console.error("Error fetching data:", error);
//     res.status(500).json({ error: "Unable to fetch data for the selected section" });
//   }
// };


// exports.getAllData = async (req, res) => {
  
//   try {
//     const section = req.query.section ? req.query.section.toLowerCase() : null;
//     console.log("Requested Section:", section);
//     const data = {};
    
//     // if (section === 'movienews') {
      
//     //   const latestBanners = await movieNewsmodel
//     //     .find({ bannerType: 'movieNews' })
//     //     .sort({ createdAt: -1 })
//     //     .limit(5);
        
    
//     //   const excludedIds = latestBanners.map(banner => banner.relatedId);

//       if (section === 'movienews'){
    
//       data.movieNews = await movieNewsmodel
//       .find({ _id: { $nin: excludedIds } })
//       .sort({ createdAt: -1 })
//       .select("-__v");
      
      
//     } else if (section === 'reviews') {
      
//       console.log("Fetching all movie reviews...");
      
      
//       data.movieReviews = await titleModel.find().sort({ createdAt: -1 }).select("-__v");
      
//     } else if (section === 'subcategories') {
//       console.log("Fetching all subcategories...");
      
     
//       data.subcategories = await subcategoryModel
//       .find()
//       .populate("category", "title imageUrl")
//       .sort({ createdAt: -1 })
//       .select("-__v");
//     }else if(section ==='category'){
//       data.categories=await categoryModel
//       .find().
//       populate('subcategories ','title imageUrl')
//       .sort({createdAt:-1})
//       .select('__v');
//     }
//     else{
//       return res.status(400).json({error:'Inavaild section provided'})
//     }
    
//     res.json(data);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Unable to fetch data for the selected section' });
//   }
// };























// ///gethome single api 

//   // try {
//   //   // Fetch banners grouped by type
//   //   const movieNewsBanners = await bannermodel.find({ bannerType: 'movieNews' }).sort({ createdAt: -1 }).limit(5);
//   //   const movieReviewsBanners = await bannermodel.find({ bannerType: 'movieReviews' }).sort({ createdAt: -1 }).limit(5);
//   //   const quizzesBanners = await bannermodel.find({ bannerType: 'categories' }).sort({ createdAt: -1 }).limit(5);

//   //   res.json({
//   //     banners: [
//   //       { type: 'movieNews', data: movieNewsBanners },
//   //       { type: 'movieReviews', data: movieReviewsBanners },
//   //       { type: 'quizzes', data: quizzesBanners },
//   //     ],
//   //   });
//   // } catch (error) {
//   //   console.error('Error fetching banners', error);
//   //   res.status(500).json({ error: 'Failed to fetch banners' });
//   // }