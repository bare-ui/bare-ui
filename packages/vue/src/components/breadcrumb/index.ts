import BreadcrumbRoot from './BreadcrumbRoot.vue';
import BreadcrumbList from './BreadcrumbList.vue';
import BreadcrumbItem from './BreadcrumbItem.vue';
import BreadcrumbLink from './BreadcrumbLink.vue';
import BreadcrumbSeparator from './BreadcrumbSeparator.vue';

export const Breadcrumb = {
	Root: BreadcrumbRoot,
	List: BreadcrumbList,
	Item: BreadcrumbItem,
	Link: BreadcrumbLink,
	Separator: BreadcrumbSeparator,
};

export type {
	BreadcrumbRootProps,
	BreadcrumbListProps,
	BreadcrumbItemProps,
	BreadcrumbLinkProps,
	BreadcrumbSeparatorProps,
} from './Breadcrumb.types';
