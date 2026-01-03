
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

interface  BreadcrumbData{ 
    href:string;
    label:string; 
}
interface BreadcrumbComponentProps{
    breadCrumbData:BreadcrumbData[];
}
export function BreadcrumbComponent({ breadCrumbData }:BreadcrumbComponentProps ) {
  return (
    <Breadcrumb className="mb-5">
      <BreadcrumbList>
        {
            breadCrumbData.length > 0 && breadCrumbData.map((dt,ind)=>{
                return (
                    ind !== breadCrumbData.length - 1 ? (
                        <div key={ind} className="flex items-center">
                            <BreadcrumbItem>
                                <BreadcrumbLink href={dt.href}>{dt.label}</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="ms-2 mt-1" />
                        </div>
                    ) : (
                        <div key={ind} className="flex items-center">
                            <BreadcrumbItem>
                                <BreadcrumbLink href={dt.href}>{dt.label}</BreadcrumbLink>
                            </BreadcrumbItem>
                        </div>
                    )
                )
            })
        }
      </BreadcrumbList>
    </Breadcrumb>
  )
}
