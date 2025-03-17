export const STATUS_CODES = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    SERVER_ERROR: 500,
};

export const MESSAGES = {
    ROLE_NOT_FOUND: 'Role not found',
    USER_NOT_FOUND: 'Role not found',

    USERNAME_EXISTS: 'Username already exists',
    EMAIL_EXISTS: 'Email already exists',

    REGISTER_FAILED: 'Registration FAILED',
    LOGIN_FAILED: 'LOGIN FAILED',
    OTP_SEND_FAILED: 'OTP CANT SEND',
    OTP_VERIFY_FAILED: 'OTP Verify FAILED',
    OTP_EXPIRED_OR_NOT_FOUND: 'OTP expired or not found',
    REFRESH_TOKEN_FAILED: 'RefreshToken failed',


    REQUIRED_OTP: 'You received OTP',
    OTP_ALREADY_SENT: 'OTP already sent',
    OTP_SENT: 'OTP sent',

    LOG_OUT_SUCCESS: 'LogOut successful',
    REFRESH_TOKEN_SUCCESS: 'RefreshToken successful',
    LOGIN_SUCCESS: 'Login successful',
    REGISTER_SUCCESS: 'Registration successful',
    OTP_SEND_SUCCESS: 'OTP sent successfully',
    OTP_VERIFY_SUCCESS: 'OTP verify successfully',

    INVALID_DATA: 'Invalid data provided',
    INVALID_CREDENTIALS: 'INVALID CREDENTIALS',


    NO_TOKEN_PROVIDED: 'No token provided',
    INVALID_TOKEN: 'Invalid token',
    UNAUTHORIZED: 'Unauthorized',
    DONT_HAVE_PERMISSION: 'You do not have permission to perform this action',
    CHECK_ROLE_FAIL: 'Check Role Fail'
};