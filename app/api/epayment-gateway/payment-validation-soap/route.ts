import { NextResponse } from "next/server";
import { parseStringPromise } from "xml2js";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
	try {
		const soapRequest = await request.text();
		const result = await parseStringPromise(soapRequest);

		const c2bRequest =
			result["soapenv:Envelope"]["soapenv:Body"][0][
				"c2b:C2BPaymentValidationRequest"
			][0];
		const transID = c2bRequest.TransID[0];
		const transTime = c2bRequest.TransTime[0];
		const billRefNumber = c2bRequest.BillRefNumber[0];
		const transAmount = c2bRequest.TransAmount[0];
		const businessShortCode = c2bRequest.BusinessShortCode[0];
		const msisdn = c2bRequest.MSISDN[0];

		console.log("Received Payment Validation:", {
			businessShortCode,
			TransID: transID,
			TransTime: transTime,
			transAmount,
			BillRefNumber: billRefNumber,
			MSISDN: msisdn,
		});

		let responseCode = "0";
		let responseDesc = "Success";

		const product = await prisma.product.findUnique({
			where: { billerReferenceNumber: billRefNumber },
			include: {
				student: true,
				item: true,
			},
		});

		if (product) {
			const customerName = `${product.student.firstName} ${
				product.student.middleName || ""
			} ${product.student.lastName}`.trim();
			const address = product.student.branch; // Assuming branch is used as address

			// Create a new order
			const order = await prisma.order.create({
				data: {
					student: { connect: { id: product.student.id } },
					product: { connect: { id: product.id } },
					parentPhone: msisdn,
					referenceNumber: `REF${Date.now()}`,
					transactionNumber: transID,
					totalPrice: parseFloat(transAmount),
				},
			});

			if (order) {
				responseCode = "0";
				responseDesc = "Order created successfully";
			} else {
				responseCode = "1";
				responseDesc = "Failed to create order";
			}
		} else {
			responseCode = "1";
			responseDesc = "Invalid BillRefNumber";
		}

		const response = `<?xml version="1.0" encoding="UTF-8"?>
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:c2b="http://cps.huawei.com/cpsinterface/c2bpayment">
        <soapenv:Header/>
        <soapenv:Body>
          <c2b:C2BPaymentValidationResult>
            <ResultCode>${responseCode}</ResultCode>
            <ResultDesc>${responseDesc}</ResultDesc>
            <ThirdPartyTransID>12</ThirdPartyTransID>
          </c2b:C2BPaymentValidationResult>
        </soapenv:Body>
      </soapenv:Envelope>`;

		return new NextResponse(response, {
			status: 200,
			headers: {
				"Content-Type": "text/xml",
			},
		});
	} catch (error) {
		console.error("Error in paymentValidationSoap:", error);
		return new NextResponse("Internal Server Error", { status: 500 });
	}
}
