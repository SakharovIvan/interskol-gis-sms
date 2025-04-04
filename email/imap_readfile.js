import { emailConfig as config } from "../config.js";

import fs from "fs";
import { Base64Decode } from "base64-stream";
import Imap from "imap";
const imap = new Imap(config.imap);

// Simple logger:
const getPost = () => {
  const markAsRead =
    config.imapOptions && config.imapOptions.markAsRead
      ? config.imapOptions.markAsRead
      : false;
  // var emailDate;
  // var emailFrom;
  function formatFilename(filename, emailFrom, emailDate) {
    // defaults to current filename:
    let name = filename;
    // if custom config is present:
    if (config.downloads) {
      // if format provided, use it to build filename:
      if (config.downloads.filenameFormat) {
        name = config.downloads.filenameFormat;
        // converts from field from "Full Name <fullname@mydomain.com>" into "fullname":
        name = name.replace(
          "$FROM",
          emailFrom.replace(/.*</i, "").replace(">", "").replace(/@.*/i, "")
        );
        // parses text date and uses timestamp:
        name = name.replace("$DATE", new Date(emailDate).getTime());
        name = name.replace("$FILENAME", filename);
      }
      // if directory provided, use it:
      if (config.downloads.directory)
        name = `${config.downloads.directory}/${name}`;
    }
    // return formatted filename:
    return name;
  }

  function findAttachmentParts(struct, attachments) {
    attachments = attachments || [];
    for (var i = 0, len = struct.length, r; i < len; ++i) {
      if (Array.isArray(struct[i])) {
        findAttachmentParts(struct[i], attachments);
      } else {
        if (
          struct[i].disposition &&
          ["inline", "attachment"].indexOf(
            struct[i].disposition.type.toLowerCase()
          ) > -1
        ) {
          attachments.push(struct[i]);
        }
      }
    }
    return attachments;
  }

  function buildAttMessageFunction(attachment, emailFrom, emailDate) {
    const filename = attachment.params.name;
    const encoding = attachment.encoding;
    console.log(emailFrom)
    return function (msg, seqno) {
      var prefix = "(#" + seqno + ") ";
      msg.on("body", function (stream, info) {
        //Create a write stream so that we can stream the attachment to file;
        //      logger.debug(prefix + 'Streaming this attachment to file', filename, info);
        var writeStream = fs.createWriteStream(
          formatFilename(filename, emailFrom, emailDate)
        );
        //     writeStream.on('finish', function() {
        //        logger.debug(prefix + 'Done writing to file %s', filename);
        //     });

        //so we decode during streaming using
        if (encoding.toLowerCase() === "base64") {
          //the stream is base64 encoded, so here the stream is decode on the fly and piped to the write stream (file)
          stream.pipe(new Base64Decode()).pipe(writeStream);
        } else {
          //here we have none or some other decoding streamed directly to the file which renders it useless probably
          stream.pipe(writeStream);
        }
      });
      //    msg.once('end', function() {
      //      logger.debug(prefix + 'Finished attachment %s', filename);
      //      logger.info(`Attachment downloaded: ${filename}`)
      //    });
    };
  }

  imap.once("ready", function () {
    //logger.info('Connected');
    imap.openBox("INBOX", !markAsRead, function (err, box) {
      if (err) throw err;
      imap.search(["UNSEEN"], function (err, results) {
        if (err) throw err;

        if (!results.length) {
          // if now unread messages, log and end connection:
          // logger.info('No new emails found');
          imap.end();
        } else {
          // logger.info(`Found ${results.length} unread emails`)
          // if unread messages, fetch and process:
          var f = imap.fetch(results, {
            bodies: ["HEADER.FIELDS (FROM TO SUBJECT DATE)"],
            struct: true,
            markSeen: markAsRead,
          });

          f.on("message", function (msg, seqno) {
            // logger.debug('Message #%d', seqno);
            const prefix = "(#" + seqno + ") ";

            var emailDate;
            var emailFrom;

            msg.on("body", function (stream, info) {
              var buffer = "";
              stream.on("data", function (chunk) {
                buffer += chunk.toString("utf8");
              });
              stream.once("end", function () {
                const parsedHeader = Imap.parseHeader(buffer);
                // set to global vars so they can be used later to format filename:
                emailFrom = parsedHeader.from[0];
                emailDate = parsedHeader.date[0];
              });
            });

            msg.once("attributes", function (attrs) {
              const attachments = findAttachmentParts(attrs.struct);
              for (var i = 0, len = attachments.length; i < len; ++i) {
                const attachment = attachments[i];
                var f = imap.fetch(attrs.uid, {
                  bodies: [attachment.partID],
                  struct: true,
                });
                //build function to process attachment message
                      if(emailFrom!=='GIS Info INTERSKOL <gis@kls-gr.ru>'){return}

                f.on(
                  "message",
                  buildAttMessageFunction(attachment, emailFrom, emailDate)
                );
              }
            });

            msg.once("end", function () {
            });
          });

          f.once("error", function (err) {
          });

          f.once("end", function () {
            imap.end();
          });
        }
      });
    });
  });

  imap.once("error", function (err) {
    //logger.error(err);
  });

  imap.once("end", function () {
  });

  imap.connect();
};
export default getPost;
