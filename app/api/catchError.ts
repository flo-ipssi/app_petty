const isFetchError = error => error instanceof TypeError && error.message === "Failed to fetch";

const catchAsyncError = (error: any): string => {
  let errorMessage = error;

  if (isFetchError(error)) {
    const errorResponse = error;
    if (errorResponse) errorMessage = errorResponse.error;
  }

  return errorMessage;
};

export default catchAsyncError;
