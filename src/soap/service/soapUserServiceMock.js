const { ResponseType } = require("../../helper/responseHelper");
const { soapUserResponse } = require("../data/soapUserResponse");

exports.getSOAPUsers = (req, res, responseType = ResponseType.SUCCESS) => {
  try {
    const soapBody = soapUserResponse
      .map(
        (user) =>
          `<user><id>${user.id}</id><name>${user.username}</name></user>`
      )
      .join("");
    const soapResponse = `
      <soap:Envelope xmlns:soap='http://www.w3.org/2003/05/soap-envelope'>
        <soap:Body>
          <users>${soapBody}</users>
        </soap:Body>
      </soap:Envelope>`;

    res.send(soapResponse);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
