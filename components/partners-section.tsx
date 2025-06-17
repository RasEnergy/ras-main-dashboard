"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
	Star,
	ArrowRight,
	Shield,
	Users,
	Sparkles,
	Calendar,
	Check,
	ExternalLink,
} from "lucide-react";
import { partnersData, partnershipBenefits } from "@/lib/partners-data";

interface PartnersSectionProps {
	onContactClick: () => void;
}

export function PartnersSection({ onContactClick }: PartnersSectionProps) {
	const [hoveredPartner, setHoveredPartner] = useState<string | null>(null);
	const [activeProductIndex, setActiveProductIndex] = useState(0);

	const strategicPartner = partnersData.find((p) => p.tier === "strategic");
	const supportingPartners = partnersData.filter((p) => p.tier !== "strategic");

	const getIconComponent = (iconName: string) => {
		const icons = { Shield, Users, Sparkles };
		return icons[iconName as keyof typeof icons] || Shield;
	};

	const getTierBadge = (tier: string) => {
		const tierColors = {
			strategic: "bg-gradient-to-r from-indigo-500 to-purple-600 text-white",
			platinum: "bg-gradient-to-r from-slate-400 to-slate-500 text-white",
			gold: "bg-gradient-to-r from-amber-400 to-yellow-500 text-white",
			silver: "bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800",
			bronze: "bg-gradient-to-r from-amber-700 to-amber-800 text-white",
		};

		return (
			tierColors[tier as keyof typeof tierColors] || "bg-gray-200 text-gray-800"
		);
	};

	return (
		<div className="mb-24 px-4">
			<div className="text-center mb-16">
				<h2 className="text-4xl font-extrabold gradient-text mb-4">
					Our Trusted Partners
				</h2>
				<p className="text-xl text-gray-600 max-w-3xl mx-auto">
					We're proud to collaborate with leading organizations that share our
					commitment to educational excellence
				</p>
			</div>

			{/* Strategic Partner Spotlight */}
			{strategicPartner && (
				<div className="mb-20">
					<div className="text-center mb-8">
						<Badge
							className={`px-4 py-1.5 text-sm font-medium ${getTierBadge(
								"strategic"
							)}`}>
							<Star className="w-4 h-4 mr-2 inline" />
							Strategic Partner
						</Badge>
					</div>
					<Card className="max-w-5xl mx-auto shadow-2xl border-none overflow-hidden bg-gradient-to-br from-white to-gray-50/50">
						<div className="lg:flex items-center">
							<div className="lg:w-2/5 p-12 flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
								<div className="text-center">
									<div className="relative inline-block mb-6">
										<div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-2xl blur-xl opacity-20"></div>
										<Image
											src={strategicPartner.logo || "/placeholder.svg"}
											alt={`${strategicPartner.name} logo`}
											width={300}
											height={120}
											className="relative rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
										/>
									</div>
									<div className="flex justify-center mb-4">
										{[...Array(5)].map((_, i) => (
											<Star
												key={i}
												className="w-5 h-5 text-yellow-400 fill-current"
											/>
										))}
									</div>
									<p className="text-sm text-gray-500 font-medium">
										Strategic Technology Partner
									</p>
									{strategicPartner.established && (
										<div className="flex items-center justify-center mt-2 text-xs text-gray-400">
											<Calendar className="w-3 h-3 mr-1" />
											Established {strategicPartner.established}
										</div>
									)}
								</div>
							</div>
							<div className="lg:w-3/5 p-12">
								<h3 className="text-2xl font-bold text-gray-800 mb-4">
									Strategic Alliance
								</h3>
								<p className="text-gray-600 text-lg leading-relaxed mb-6">
									{strategicPartner.description ||
										"Our strategic partner has been instrumental in advancing educational technology and supporting thousands of students across the region."}
								</p>
								<div className="flex items-center text-indigo-600 font-semibold cursor-pointer hover:text-indigo-700 transition-colors">
									<span>Learn more about our alliance</span>
									<ArrowRight className="w-4 h-4 ml-2" />
								</div>
							</div>
						</div>
					</Card>

					{/* Product Showcase */}
					{strategicPartner.products &&
						strategicPartner.products.length > 0 && (
							<div className="mt-12 max-w-6xl mx-auto">
								<h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
									Featured Solutions
								</h3>
								<p className="text-gray-600 text-lg max-w-3xl mx-auto text-center mb-10">
									Explore innovative products from our strategic partner that
									enhance our educational ecosystem
								</p>

								<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
									{strategicPartner.products.map((product, index) => (
										<Card
											key={product.id}
											className={`overflow-hidden border-none shadow-xl transition-all duration-300 hover:shadow-2xl ${
												activeProductIndex === index
													? "ring-2 ring-indigo-500 ring-offset-2"
													: ""
											}`}
											onClick={() => setActiveProductIndex(index)}>
											<div className="relative h-48 w-full overflow-hidden">
												<Image
													src={product.image || "/placeholder.svg"}
													alt={product.name}
													layout="fill"
													objectFit="cover"
													className="transition-transform duration-500 hover:scale-105"
												/>
												<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
													<h4 className="text-white font-bold text-xl p-4">
														{product.name}
													</h4>
												</div>
											</div>
											<CardContent className="p-6">
												<p className="text-gray-600 line-clamp-2 mb-4">
													{product.description}
												</p>
												<Button
													variant="outline"
													size="sm"
													className="w-full border-indigo-200 text-indigo-700 hover:bg-indigo-50">
													ተጨማሪ
												</Button>
											</CardContent>
										</Card>
									))}
								</div>

								{/* Detailed Product View */}
								{strategicPartner.products[activeProductIndex] && (
									<Card className="border-none shadow-2xl overflow-hidden bg-gradient-to-br from-white to-gray-50/50 animate-fade-in-up">
										<div className="lg:flex">
											<div className="lg:w-1/2 relative">
												<Image
													src={
														strategicPartner.products[activeProductIndex]
															.image || "/placeholder.svg"
													}
													alt={
														strategicPartner.products[activeProductIndex].name
													}
													width={600}
													height={400}
													className="h-full w-full object-cover"
												/>
												<div className="absolute top-4 left-4">
													<Badge className="bg-indigo-500 hover:bg-indigo-600 text-white">
														Featured Solution
													</Badge>
												</div>
											</div>
											<div className="lg:w-1/2 p-8">
												<h3 className="text-2xl font-bold text-gray-800 mb-2">
													{strategicPartner.products[activeProductIndex].name}
												</h3>
												<p className="text-sm text-indigo-600 font-medium mb-4">
													By {strategicPartner.name}
												</p>
												<p className="text-gray-600 text-lg mb-6">
													{
														strategicPartner.products[activeProductIndex]
															.description
													}
												</p>

												{strategicPartner.products[activeProductIndex]
													.features && (
													<div className="mb-8">
														<h4 className="text-lg font-semibold text-gray-800 mb-3">
															ዋና ባህሪያት
														</h4>
														<ul className="space-y-2">
															{strategicPartner.products[
																activeProductIndex
															].features?.map((feature, idx) => (
																<li key={idx} className="flex items-start">
																	<Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
																	<span className="text-gray-600">
																		{feature}
																	</span>
																</li>
															))}
														</ul>
													</div>
												)}

												{/* <div className="flex flex-col sm:flex-row gap-4">
													<Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white">
														Request Demo
													</Button>
													<Button
														variant="outline"
														className="border-indigo-200 text-indigo-700 hover:bg-indigo-50 flex items-center">
														<span>Visit Product Page</span>
														<ExternalLink className="w-4 h-4 ml-2" />
													</Button>
												</div> */}
											</div>
										</div>
									</Card>
								)}
							</div>
						)}
				</div>
			)}

			{/* Supporting Partners Grid */}
			<div className="mb-16">
				<div className="text-center mb-12">
					<h3 className="text-2xl font-bold text-gray-800 mb-4">
						Supporting Partners
					</h3>
					<p className="text-gray-600 max-w-2xl mx-auto">
						We work with industry leaders and innovative organizations to
						deliver comprehensive solutions
					</p>
				</div>

				<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-12">
					{supportingPartners.map((partner) => (
						<div
							key={partner.id}
							className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-gray-100 cursor-pointer"
							onMouseEnter={() => setHoveredPartner(partner.id)}
							onMouseLeave={() => setHoveredPartner(null)}>
							<div className="text-center">
								<div className="relative mb-4">
									<div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl blur-sm opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
									<Image
										src={partner.logo || "/placeholder.svg"}
										alt={`${partner.name} logo`}
										width={120}
										height={80}
										className="relative mx-auto rounded-lg opacity-70 group-hover:opacity-100 transition-opacity duration-300"
									/>
								</div>
								<Badge className={`${getTierBadge(partner.tier)} mb-2`}>
									{partner.tier.charAt(0).toUpperCase() + partner.tier.slice(1)}
								</Badge>
								<p className="text-xs text-gray-500 font-medium">
									{partner.category}
								</p>
								{hoveredPartner === partner.id && (
									<div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
										<p className="text-xs font-semibold text-gray-700">
											{partner.name}
										</p>
									</div>
								)}
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Partnership Benefits */}
			<div className="bg-gradient-to-r from-gray-50 to-white rounded-3xl p-12 border border-gray-100">
				<div className="text-center mb-12">
					<h3 className="text-3xl font-bold gradient-text mb-4">
						Partnership Benefits
					</h3>
					<p className="text-gray-600 text-lg max-w-3xl mx-auto">
						Our strategic partnerships enable us to deliver enhanced value and
						comprehensive solutions
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					{partnershipBenefits.map((benefit, index) => {
						const IconComponent = getIconComponent(benefit.icon);
						return (
							<div key={index} className="text-center group">
								<div
									className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${benefit.gradient} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
									<IconComponent className="w-8 h-8 text-white" />
								</div>
								<h4 className="text-xl font-bold text-gray-800 mb-3">
									{benefit.title}
								</h4>
								<p className="text-gray-600 leading-relaxed">
									{benefit.description}
								</p>
							</div>
						);
					})}
				</div>
			</div>

			{/* Partnership CTA */}
			<div className="text-center mt-16">
				<div className="inline-flex flex-col sm:flex-row gap-4">
					<Button
						size="lg"
						className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
						onClick={onContactClick}>
						Become a Partner
					</Button>
					<Button
						size="lg"
						variant="outline"
						className="border-indigo-200 text-indigo-700 hover:bg-indigo-50 px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
						View All Partners
					</Button>
				</div>
			</div>
		</div>
	);
}
