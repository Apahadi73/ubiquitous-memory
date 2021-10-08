//checks email for valid college email address
export let checkCollegeEmail = function (email: String) {
  const emailArray = email.split("@");
  // console.log(`email: ${email} username: ${emailArray[0]} || college domain: ${emailArray[1]}}`);
  return emailArray[1] != "patriots.uttyler.edu";
};
