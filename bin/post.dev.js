import getPost from "../email/imap_readfile.js";
try {
  getPost();

} catch (err) {
  console.log(err);
}