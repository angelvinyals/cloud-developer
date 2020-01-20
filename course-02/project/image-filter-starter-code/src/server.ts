import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';
import {re_weburl} from './util/re_weburl'
import { read } from 'fs';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */
  
  app.get("/filteredimage", async (req, res) => {
    
    const {image_url} = req.query;
    console.log(image_url)
    
    // 1. validate the image_url query
    if (!image_url) {
      return res.status(400).send({
        message: "The image url is required. Please add query 'image_url=' after '?'"
      });
    }   
    
    if (!re_weburl.test(image_url)) {
        return res.status(400).send(`The url is malformed. image_url= ${image_url}`);
    }

    try {
    // 2. call filterImageFromURL(image_url) to filter the image    
      const filteredImageFromURL = await filterImageFromURL(image_url);
    // 3. Send the resulting file in the response and 
    // 4. Deletes any files on the server on finish of the response  
      res.sendFile(filteredImageFromURL, () =>
        deleteLocalFiles([filteredImageFromURL])
      );
    } catch (error) {
      res.sendStatus(422).send("Unable to process image at the provided url");
    }
  });
  

  //! END @TODO1
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();