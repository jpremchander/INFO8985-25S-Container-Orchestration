export default {
  transform: {
    "^.+\\.js$": "babel-jest"  // Tells Jest to use babel-jest for JavaScript files
  },
  testEnvironment: "node",  // Ensure Jest uses the Node.js environment
  moduleFileExtensions: ["js", "json", "jsx", "node"]
};
