let UserRegisterDTO = function(combinedUserInfo) {
  if (!combinedUserInfo) {
    console.error("No user info provided to DTO");
    return null;
  }

  return {
    id: combinedUserInfo.id || null,
    name: combinedUserInfo.name || null,
    email: combinedUserInfo.email || null,
  };
}


let UserLoginDTO = function(updatedUserInfo) {
  if (!updatedUserInfo) {
    console.error("No user info provided to DTO");
    return null;
  }

  return {
    id: updatedUserInfo.id || null,
    email: updatedUserInfo.email || null,
    accessToken: updatedUserInfo.accessToken || null,
  };
}

module.exports = {UserRegisterDTO,UserLoginDTO}


  



