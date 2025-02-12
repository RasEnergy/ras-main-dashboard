import { NextResponse } from "next/server";
import { parseStringPromise } from "xml2js";

export async function POST(request: Request) {
	try {
		const soapRequest = await request.text();
		const result = await parseStringPromise(soapRequest);

		const c2bRequest =
			result["soapenv:Envelope"]["soapenv:Body"][0][
				"c2b:C2BPaymentConfirmationRequest"
			][0];
		const transType = c2bRequest.TransType[0];
		const transID = c2bRequest.TransID[0];
		const transTime = c2bRequest.TransTime[0];
		const transAmount = c2bRequest.TransAmount[0];
		const businessShortCode = c2bRequest.BusinessShortCode[0];
		const msisdn = c2bRequest.MSISDN[0];
		const kycInfos = c2bRequest.KYCInfo;

		console.log("Received Payment Confirmation:", {
			TransType: transType,
			TransID: transID,
			TransTime: transTime,
			TransAmount: transAmount,
			BusinessShortCode: businessShortCode,
			MSISDN: msisdn,
			OTHER: kycInfos,
		});

		// Here you would typically update the order status or perform any other necessary actions
		// For this example, we'll just log the confirmation

		const response = `<?xml version="1.0" encoding="UTF-8"?>
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
        <soapenv:Body>
          <Response>
            <Message>Payment confirmation received and logged successfully.</Message>
          </Response>
        </soapenv:Body>
      </soapenv:Envelope>`;

		return new NextResponse(response, {
			status: 200,
			headers: {
				"Content-Type": "text/xml",
			},
		});
	} catch (error) {
		console.error("Error in paymentConfirmationSoap:", error);
		return new NextResponse("Internal Server Error", { status: 500 });
	}
}
