class ApiResponse {
    constructor(statusCode, version, pairs, message = "success") {
      // this.statusCode = statusCode;
      this.schemaVersion = version;
      this.pairs = pairs;
      this.message = message;
      this.success = statusCode < 400;
    }
  }
  
  export { ApiResponse };