"use client";

import React from "react";
import Link from "next/link";
import { Mail, Phone, MapPin, ExternalLink } from "lucide-react";

export function PrivacyPolicyContent() {
  return (
    <section className="w-full bg-[#f8faf9] py-16 sm:py-20 md:py-24 text-[#1f2723]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-10 sm:space-y-12">
          {/* 1. About This Policy */}
          <div className="space-y-3">
            <h2 className="font-heading text-xl sm:text-2xl font-normal text-[#044133] tracking-tight">
              About This Policy
            </h2>
            <p className="font-sans text-xs sm:text-sm text-[#4a5851] font-light leading-relaxed text-justify sm:text-left">
              The Premium Homes Ltd. (“TPHL”, “we”, “our” or “us”) respects your privacy.
              This policy explains how information may be handled when you visit our
              website, explore our property projects, submit an inquiry, request
              information, or contact our team. It applies to information collected through
              our website and related communications. Where a particular service provides
              its own notice or terms, please read those as well.
            </p>
          </div>

          {/* 2. Information We Collect */}
          <div className="space-y-3">
            <h2 className="font-heading text-xl sm:text-2xl font-normal text-[#044133] tracking-tight">
              Information We Collect
            </h2>
            <p className="font-sans text-xs sm:text-sm text-[#4a5851] font-light leading-relaxed text-justify sm:text-left">
              We may collect information you choose to provide, such as your name, email
              address, phone number, message, and the project or property you ask about. If
              you request a callback, consultation, or site visit, we may use the details
              and preferences you share to respond to that request.
            </p>
            <p className="font-sans text-xs sm:text-sm text-[#4a5851] font-light leading-relaxed text-justify sm:text-left mt-2">
              When you browse our website, technical information may also be collected, such
              as your browser and device type, pages viewed, approximate usage data, and
              cookie or similar identifiers, where those tools are enabled.
            </p>
          </div>

          {/* 3. How We Use Your Information */}
          <div className="space-y-3">
            <h2 className="font-heading text-xl sm:text-2xl font-normal text-[#044133] tracking-tight">
              How We Use Your Information
            </h2>
            <p className="font-sans text-xs sm:text-sm text-[#4a5851] font-light leading-relaxed">
              We may use information to:
            </p>
            <ul className="space-y-2 pl-5 list-disc text-xs sm:text-sm text-[#4a5851] font-light leading-relaxed">
              <li>Respond to inquiries and provide requested project or property details</li>
              <li>Arrange callbacks, consultations, appointments, or site visits</li>
              <li>Provide customer support and follow up on requests</li>
              <li>Operate, maintain, secure, and improve our website and services</li>
              <li>Understand website usage and improve content and navigation</li>
              <li>Address fraud, security, legal, regulatory, or record-keeping needs</li>
            </ul>
            <p className="font-sans text-xs sm:text-sm text-[#4a5851] font-light leading-relaxed mt-2">
              We aim to use information for purposes relevant to your interaction with us and
              as permitted by applicable law.
            </p>
          </div>

          {/* 4. Marketing Communications */}
          <div className="space-y-3">
            <h2 className="font-heading text-xl sm:text-2xl font-normal text-[#044133] tracking-tight">
              Marketing Communications
            </h2>
            <p className="font-sans text-xs sm:text-sm text-[#4a5851] font-light leading-relaxed text-justify sm:text-left">
              If you have asked to receive updates or where permitted by applicable law, we
              may contact you about new projects, property information, events, or company
              announcements. You can ask us to stop sending promotional messages at any
              time by using an unsubscribe option where available or by contacting us
              directly. We may still send non-promotional messages needed to respond to an
              inquiry or provide a service you requested.
            </p>
          </div>

          {/* 5. Cookies and Analytics */}
          <div className="space-y-3">
            <h2 className="font-heading text-xl sm:text-2xl font-normal text-[#044133] tracking-tight">
              Cookies and Analytics
            </h2>
            <p className="font-sans text-xs sm:text-sm text-[#4a5851] font-light leading-relaxed text-justify sm:text-left">
              Our website may use cookies and similar technologies to support essential
              functions, remember preferences, understand traffic, and improve the browsing
              experience. You can manage or disable cookies through your browser settings.
              Some features may not work as intended if certain cookies are disabled. The
              exact cookies and analytics services used on the live website should be
              confirmed before this policy is published.
            </p>
          </div>

          {/* 6. How We Share Information */}
          <div className="space-y-3">
            <h2 className="font-heading text-xl sm:text-2xl font-normal text-[#044133] tracking-tight">
              How We Share Information
            </h2>
            <p className="font-sans text-xs sm:text-sm text-[#4a5851] font-light leading-relaxed text-justify sm:text-left">
              Information may be shared when reasonably necessary with service providers
              that support website hosting, communications, security, customer support, or
              analytics; with professional advisers assisting our business; or with public
              authorities when disclosure is required by law. Information may also be
              handled as part of a business reorganisation or transfer, subject to
              appropriate safeguards. We aim to limit access to information to what is
              needed for the relevant purpose.
            </p>
          </div>

          {/* 7. Data Retention */}
          <div className="space-y-3">
            <h2 className="font-heading text-xl sm:text-2xl font-normal text-[#044133] tracking-tight">
              Data Retention
            </h2>
            <p className="font-sans text-xs sm:text-sm text-[#4a5851] font-light leading-relaxed text-justify sm:text-left">
              We keep information for only as long as reasonably necessary to respond to
              requests, maintain relevant business and project records, provide services,
              resolve disputes, and meet applicable legal obligations. The appropriate
              retention period depends on the type of information and the reason it was
              collected. When information is no longer needed, it should be securely
              deleted, anonymised, or otherwise handled in accordance with applicable
              requirements.
            </p>
          </div>

          {/* 8. How We Protect Your Information */}
          <div className="space-y-3">
            <h2 className="font-heading text-xl sm:text-2xl font-normal text-[#044133] tracking-tight">
              How We Protect Your Information
            </h2>
            <p className="font-sans text-xs sm:text-sm text-[#4a5851] font-light leading-relaxed text-justify sm:text-left">
              We use reasonable administrative and technical measures intended to protect
              information from unauthorised access, loss, misuse, alteration, or disclosure.
              Access should be limited to people and service providers who need the
              information for a legitimate purpose. However, no website, storage system, or
              electronic transmission can be guaranteed to be completely secure.
            </p>
          </div>

          {/* 9. Your Privacy Rights */}
          <div className="space-y-3">
            <h2 className="font-heading text-xl sm:text-2xl font-normal text-[#044133] tracking-tight">
              Your Privacy Rights
            </h2>
            <p className="font-sans text-xs sm:text-sm text-[#4a5851] font-light leading-relaxed text-justify sm:text-left">
              You may contact us to ask about information you have submitted, request
              correction of inaccurate details, or make another privacy-related request. We
              will review requests in accordance with applicable law and may need to verify
              your identity before responding. Some information may need to be retained where
              required by law or for legitimate business and record-keeping purposes.
            </p>
          </div>

          {/* 10. Third-Party Websites */}
          <div className="space-y-3">
            <h2 className="font-heading text-xl sm:text-2xl font-normal text-[#044133] tracking-tight">
              Third-Party Websites
            </h2>
            <p className="font-sans text-xs sm:text-sm text-[#4a5851] font-light leading-relaxed text-justify sm:text-left">
              Our website may contain links to third-party websites, maps, social networks,
              or other services. Those services have their own privacy notices and
              practices. We encourage you to review their policies before sharing information
              with them. This policy applies to TPHL’s website and does not govern services we
              do not control.
            </p>
          </div>

          {/* 11. Children's Privacy */}
          <div className="space-y-3">
            <h2 className="font-heading text-xl sm:text-2xl font-normal text-[#044133] tracking-tight">
              Children’s Privacy
            </h2>
            <p className="font-sans text-xs sm:text-sm text-[#4a5851] font-light leading-relaxed text-justify sm:text-left">
              You may contact us to ask about information you have submitted, request correction
              of inaccurate details, or make another privacy-related request. We will review
              requests in accordance with applicable law and may need to verify your identity
              before responding. Some information may need to be retained where required by law
              or for legitimate business and record-keeping purposes.
            </p>
          </div>

          {/* 12. Changes to This Policy */}
          <div className="space-y-3">
            <h2 className="font-heading text-xl sm:text-2xl font-normal text-[#044133] tracking-tight">
              Changes to This Policy
            </h2>
            <p className="font-sans text-xs sm:text-sm text-[#4a5851] font-light leading-relaxed text-justify sm:text-left">
              We may update this Privacy Policy from time to time to reflect changes in our
              legal obligations, operational practices, or website features. The updated version
              will be published on this page with an updated date where appropriate. Your
              continued use of the website after changes are posted indicates your
              acknowledgment of the updated policy.
            </p>
          </div>

          {/* 13. Contact Us */}
          <div className="space-y-4 pt-4 border-t border-[#e5dfd2]/80">
            <h2 className="font-heading text-xl sm:text-2xl font-normal text-[#044133] tracking-tight">
              Contact Us
            </h2>
            <p className="font-sans text-xs sm:text-sm text-[#4a5851] font-light leading-relaxed">
              If you have any questions about this Privacy Policy, you can contact us:
            </p>

            <div className="mt-4 space-y-2.5 font-sans text-xs sm:text-sm text-[#384640]">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#044133] flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-medium text-[#1f2723]">The Premium Homes Ltd</span>
                  <br />
                  <span>
                    Land View Commercial Center, 9th Floor, 28 Gulshan North C/A,
                    Gulshan Circle-2, Dhaka
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#044133] flex-shrink-0" />
                <span className="font-medium text-[#1f2723]">Email:</span>
                <a
                  href="mailto:info@dpremiumhomes.com"
                  className="text-[#044133] hover:text-[#d0a65b] underline-offset-4 hover:underline transition-colors"
                >
                  info@dpremiumhomes.com
                </a>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#044133] flex-shrink-0" />
                <span className="font-medium text-[#1f2723]">Phone:</span>
                <a
                  href="tel:+8801958253301"
                  className="text-[#044133] hover:text-[#d0a65b] underline-offset-4 hover:underline transition-colors"
                >
                  +8801958253301
                </a>
              </div>

              <div className="flex items-center gap-2.5 pt-1">
                <ExternalLink className="w-4 h-4 text-[#044133] flex-shrink-0" />
                <span className="font-medium text-[#1f2723]">Contact page:</span>
                <Link
                  href="/contact"
                  className="text-[#044133] hover:text-[#d0a65b] underline-offset-4 hover:underline transition-colors"
                >
                  https://www.dpremiumhomes.com/contact
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
