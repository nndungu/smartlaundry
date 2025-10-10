//package ke.co.smartlaundry.exceptions;
//
//import com.fasterxml.jackson.core.JsonParseException;
//import jakarta.servlet.http.HttpServletRequest;
//import org.flywaydb.core.api.ErrorCode;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.context.MessageSource;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.http.converter.HttpMessageNotReadableException;
//import org.springframework.web.HttpMediaTypeNotSupportedException;
//import org.springframework.web.bind.annotation.ControllerAdvice;
//import org.springframework.web.bind.annotation.ExceptionHandler;
//
//import java.util.Locale;
//
//@ControllerAdvice
//public class ApiErrorHandler {
//    private static final Logger log = LoggerFactory
//            .getLogger(ApiErrorHandler.class);
//    private final MessageSource messageSource;
//
//    @Autowired
//    public ApiErrorHandler(MessageSource messageSource) {
//        this.messageSource = messageSource;
//    }
//
//    @ExceptionHandler(Exception.class)
//    public ResponseEntity<Error> handleException
//            (HttpServletRequest request, Exception exception, Locale locale) {
//        Error error = ErrorUtils
//                .createError(ErrorCode.GENERIC_ERROR.getErrMsgKey(),
//                ErrorCode.GENERIC_ERROR.getErrCode(), HttpStatus.INTERNAL_SERVER_ERROR.value())
//                .setUrl(request.getRequestURL().toString())
//                        .setReqMethod(request.getMethod());
//        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
//    }
//
//    @ExceptionHandler(HttpMediaTypeNotSupportedException.class)
//    public ResponseEntity<Error> handleHttpMediaTypeNotSupportedException
//            (HttpServletRequest request,
//             HttpMediaTypeNotSupportedException exception, Locale locale) {
//        exception.printStackTrace(); //TODO: Should be kept only for development
//        Error error = ErrorUtils
//                .createError(ErrorCode.HTTP_MEDIA_TYPE_NOT_SUPPORTED.
//                        getErrMsgKey(),
//                        ErrorCode.HTTP_MEDIA_TYPE_NOT_SUPPORTED.
//                        getErrCode(),
//                        HttpStatus.UNSUPPORTED_MEDIA_TYPE.value()) .
//                setUrl(request.getMethod());
//        log.info("HttpMediaTypeNotSupportedException :: request.getMethod() : " + request.getMethod());
//                return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
//    }
//
//    @ExceptionHandler(HttpMessageNotReadableException.class)
//    public ResponseEntity<Error> handleHttpMessageNotReadableException
//            (HttpServletRequest request, HttpMessageNotReadableException exception, Locale locale) {
//        exception.printStackTrace(); //TODO: Should be kept only for development
//        Error error = ErrorUtils
//                .createError(ErrorCode.HTTP_MESSAGE_NOT_READABLE.getErrMsgKey(),
//                        ErrorCode.HTTP_MESSAGE_NOT_READABLE.getErrCode(),
//                HttpStatus.NOT_ACCEPTABLE.value()).setUrl(request.getRequestURL().toString()
//                )
//                .setReqMethod(request.getMethod());
//        log.info("HttpMessageNotReadableException :: request.getMethod() : " + request.getMethod());
//        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
//    }
//
//    @ExceptionHandler(JsonParseException.class)
//    public ResponseEntity<Error> handleJsonParseException
//            (HttpServletRequest request,
//             JsonParseException exception, Locale locale) {
//        exception.printStackTrace(); //TODO: Should be kept only for development
//        Error error = ErrorUtils
//                .createError(ErrorCode.JSON_PARSE_ERROR.getErrMsgKey(),
//                        ErrorCode.JSON_PARSE_ERROR.getErrCode(),
//                        HttpStatus.NOT_ACCEPTABLE.value()).setUrl(request.getRequestURL().toString()
//                )
//                .setReqMethod(request.getMethod());
//        log.info("JsonParseException :: request.getMethod() : " + request.getMethod());
//        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
//    }
//}
