"use client";

import { Card } from "@/components/ui/card";
import { FaWordpress, FaShopify, FaWix } from "react-icons/fa";
import { SiNetlify, SiVercel } from "react-icons/si";
import { TbBrandNextjs } from "react-icons/tb";
import { BiLogoPostgresql } from "react-icons/bi";
import { BsGithub } from "react-icons/bs";
import { IconType } from "react-icons";

interface Integration {
  name: string;
  icon: IconType;
}

const integrations: Integration[] = [
  { name: "WordPress", icon: FaWordpress },
  { name: "Shopify", icon: FaShopify },
  { name: "Wix", icon: FaWix },
  { name: "Next.js", icon: TbBrandNextjs },
  { name: "Netlify", icon: SiNetlify },
  { name: "GitHub", icon: BsGithub },
  { name: "Vercel", icon: SiVercel },
  { name: "PostgreSQL", icon: BiLogoPostgresql },
];

export function IntegrationSection() {
  return (
    <div className="bg-black text-white py-16">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-2xl font-semibold mb-2">
          Integrations and Extensibility
        </h2>
        <p className="text-gray-400 mb-8">
          Connect with your favorite tools and platforms for seamless workflow
          integration
        </p>

        <div className="grid grid-cols-4 gap-6">
          {integrations.map((integration) => {
            const IconComponent = integration.icon;
            return (
              <Card
                key={integration.name}
                className="bg-zinc-900 border-zinc-800 p-4 flex flex-col items-center justify-center hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                {/* <IconComponent size={32} className="w-8 h-8 mb-2" /> */}
                <span className="text-sm text-gray-300">
                  {integration.name}
                </span>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
