//package ke.co.smartlaundry.exceptions;
//
//import io.jsonwebtoken.lang.Strings;
//
//
//public class Error {
//
//    private static final long serialVersionUID = 1L;
//
//    /**
//     * App error code, which is different from HTTP error code.
//     */
//    private String errorCode;
//
//    /**
//     * Short, human-readable summery of the problem.
//     */
//    private String message;
//
//    /**
//     * HTTP status code
//     */
//    private Integer status;
//
//    /**
//     * Url of request that produced the error.
//     */
//    private String url = "Not available";
//
//    /**
//     * Method of request that produced the error.
//     */
//    private String reqMethod = "Not Available";
//
//
//    // Getters and Setters
//    public String getErrorCode() {
//        return errorCode;
//    }
//    public void setErrorCode(String errorCode) {
//        this.errorCode = errorCode;
//    }
//
//    public String getMessage() {
//        return message;
//    }
//    public void setMessage(String message) {
//        this.message = message;
//    }
//
//    public Integer getStatus() {
//        return status;
//    }
//    public void setStatus(Integer status) {
//        this.status = status;
//
//    }public String getUrl() {
//        return url;
//    }
//
//    public Error setUrl(String url) {
//        if (String.isNotBlank(url)) {
//            this.url = url;
//        }
//        return this;
//    }
//
//    public String getReqMethod() {
//        return reqMethod;
//    }
//    public Error setReqMethod(String method) {
//        if (Strings.isNotBlank(method)) {
//            this.reqMethod = method;
//        }
//        return this;
//    }
//}
