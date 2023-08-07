const jwt = require("jsonwebtoken");

function authenticate(req, res, next) {
  // Get the token from the request header
  const authHeader = req.header("Authorization");
  

  // Check if token exists
  if (!authHeader) {
    return res.status(401).json({ message: "Authorization token not found" });
  }

  const token = authHeader.replace("Bearer ", "");
  console.log(token);

  try {
    // Verify the token using your secret key
    console.log("hello");
    console.log(jwt.verify(token, process.env.JWT_SECRET_KEY));
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log("decoded: ---> ", decoded);

    // Attach the decoded payload to the request for further use
    req.user = decoded.user;

    next(); // Authentication successful, move to the next middleware
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: "Invalid token" });
  }
}

module.exports = authenticate;
