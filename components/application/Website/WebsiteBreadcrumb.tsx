import { WEBSITE_HOME } from "@/routes/WebsiteRoute";
import Link from "next/link";

interface linksDataType{
    label:string;
    href?:string;
}
interface WebsiteBreadcrumbProps{
    breadcrumb:{
        title:string;
        links:linksDataType[];
    }
}

const WebsiteBreadcrumb = ({ breadcrumb }:WebsiteBreadcrumbProps) => {
  return (
    <div className={`py-10 flex justify-center items-center bg-[url('/assets/images/page-title.png')] bg-cover bg-center`}>
       <div>
            <h1 className="text-2xl font-semibold mb-2 text-center">{breadcrumb.title}</h1>
            <ul className="flex gap-2 justify-center">
                <li><Link className="font-semibold" href={WEBSITE_HOME}>Home</Link></li>
                {
                    breadcrumb.links.map((link,index)=>(
                        <li key={index}>
                            <span className="me-1">/</span>
                            {
                                link.href ? (
                                    <Link href={link.href}>{link.label}</Link>
                                ) : (
                                    <span>{link.label}</span>
                                )
                            }
                        </li>
                    ))
                }
            </ul>
        </div>

    </div>
  );
};

export default WebsiteBreadcrumb;
