from typing import Any, Callable
from fastapi.requests import Request
from fastapi.responses import JSONResponse
from fastapi import FastAPI, status
from sqlalchemy.exc import SQLAlchemyError

class SelfAIException(Exception):
    pass


class UserAlreadyExists(SelfAIException):
    """User has provided an email for a user who exists during sign up."""
    pass

class UserNotFound(SelfAIException):
    """User Not Found"""
    pass

class InvalidCredentials(SelfAIException):
    """User provided wrong email and password during log in."""
    pass

class UnsupportedFileType(SelfAIException):
    """User provided file of unsupported extension"""
    pass

class NoSourceProvided(SelfAIException):
    """User didn't provided any source"""
    pass

class InvalidToken(SelfAIException):
    """User has provided an invalid or expired token"""
    pass

class AccessTokenRequired(SelfAIException):
    """User has provided a refresh token when an access token is needed"""
    pass

class RefreshTokenRequired(SelfAIException):
    """User has provided an access token when a refresh token is needed"""
    pass


def create_exception_handler(
    status_code: int, initial_detail: Any
) -> Callable[[Request, Exception], JSONResponse]:

    async def exception_handler(request: Request, exc: SelfAIException):

        return JSONResponse(content=initial_detail, status_code=status_code)

    return exception_handler


def register_all_errors(app: FastAPI):
    app.add_exception_handler(
        UserAlreadyExists,
        create_exception_handler(
            status_code=status.HTTP_403_FORBIDDEN,
            initial_detail={
                "message": "User with email already exists",
                "error_code": "user_exists",
            },
        ),
    )

    app.add_exception_handler(
        UserNotFound,
        create_exception_handler(
            status_code=status.HTTP_404_NOT_FOUND,
            initial_detail={
                "message": "User not found",
                "error_code": "user_not_found",
            },
        ),
    )

    app.add_exception_handler(
        InvalidCredentials,
        create_exception_handler(
            status_code=status.HTTP_400_BAD_REQUEST,
            initial_detail={
                "message": "Invalid Email or Password",
                "error_code": "invalid_email_or_password",
            },
        ),
    )

    app.add_exception_handler(
        UnsupportedFileType,
        create_exception_handler(
            status_code=status.HTTP_400_BAD_REQUEST,
            initial_detail={
                "message": "Unsupported file type. Allowed types are: ['.pdf','.html' ,'.docx' ,'.md']",
                "error_code": "unsupported_file_type",
            },
        ),
    )

    app.add_exception_handler(
        NoSourceProvided,
        create_exception_handler(
            status_code=status.HTTP_400_BAD_REQUEST,
            initial_detail={
                "message": "No file or text were provided.",
                "error_code": "no_text_or_file",
            },
        ),
    )

    app.add_exception_handler(
        InvalidToken,
        create_exception_handler(
            status_code=status.HTTP_401_UNAUTHORIZED,
            initial_detail={
                "message": "Token is invalid Or expired",
                "resolution": "Please get new token",
                "error_code": "invalid_token",
            },
        ),
    )

    app.add_exception_handler(
        AccessTokenRequired,
        create_exception_handler(
            status_code=status.HTTP_401_UNAUTHORIZED,
            initial_detail={
                "message": "Please provide a valid access token",
                "resolution": "Please get an access token",
                "error_code": "access_token_required",
            },
        ),
    )
    app.add_exception_handler(
        RefreshTokenRequired,
        create_exception_handler(
            status_code=status.HTTP_403_FORBIDDEN,
            initial_detail={
                "message": "Please provide a valid refresh token",
                "resolution": "Please get an refresh token",
                "error_code": "refresh_token_required",
            },
        ),
    )

    @app.exception_handler(SQLAlchemyError)
    async def database__error(request, exc):
        print(str(exc))
        return JSONResponse(
            content={
                "message": "Oops! Something went wrong",
                "error_code": "server_error",
            },
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
    
    