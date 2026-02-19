// Function that throws an error
function throwError() {
  throw new Error("Something went wrong!");
}

// Init function that calls throwError and handles the error
function init() {
  try {
    throwError();
  } catch (e) {
    console.log(e);
  }
}

// Call the init function
init();
