import { NextResponse } from "next/server";
import { parseStringPromise } from "xml2js";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
	try {
		const soapRequest = await request.text();
		const result = await parseStringPromise(soapRequest);

		const c2bRequest =
			result["soapenv:Envelope"]["soapenv:Body"][0][
				"c2b:C2BPaymentQueryRequest"
			][0];
		const transType = c2bRequest.TransType[0];
		const transID = c2bRequest.TransID[0];
		const transTime = c2bRequest.TransTime[0];
		const businessShortCode = c2bRequest.BusinessShortCode[0];
		const billRefNumber = c2bRequest.BillRefNumber[0];
		const msisdn = c2bRequest.MSISDN[0];

		console.log("Received Payment Query:", {
			TransType: transType,
			TransID: transID,
			TransTime: transTime,
			BusinessShortCode: businessShortCode,
			BillRefNumber: billRefNumber,
			MSISDN: msisdn,
		});

		let responseCode = "0";
		let responseDesc = "Success";
		let responseTransID = transID;
		let responseBillRefNumber = billRefNumber;
		let utilityName = "Bill Payment";
		let customerName = "Test Customer";
		let amount = 2;

		// Find product details by BillRefNumber
		const product = await prisma.product.findUnique({
			where: { billerReferenceNumber: billRefNumber },
			include: {
				student: true,
				item: true,
			},
		});

		if (product) {
			customerName = `${product.student.firstName} ${
				product.student.middleName || ""
			} ${product.student.lastName}`.trim();
			amount = product.totalPrice;
			utilityName = product.item.name;
		} else {
			responseCode = "1";
			responseDesc = "Invalid request";
		}

		const response = `<?xml version="1.0" encoding="UTF-8"?>
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:c2b="http://cps.huawei.com/cpsinterface/c2bpayment">
        <soapenv:Header/>
        <soapenv:Body>
          <c2b:C2BPaymentQueryResult>
            <ResultCode>${responseCode}</ResultCode>
            <ResultDesc>${responseDesc}</ResultDesc>
            <TransID>${responseTransID}</TransID>
            <BillRefNumber>${responseBillRefNumber}</BillRefNumber>
            <UtilityName>${utilityName}</UtilityName>
            <CustomerName>${customerName}</CustomerName>
            <Amount>${amount}</Amount>
          </c2b:C2BPaymentQueryResult>
        </soapenv:Body>
      </soapenv:Envelope>`;

		return new NextResponse(response, {
			status: 200,
			headers: {
				"Content-Type": "text/xml",
			},
		});
	} catch (error) {
		console.error("Error in queryBillSoap:", error);
		return new NextResponse("Internal Server Error", { status: 500 });
	}
}
