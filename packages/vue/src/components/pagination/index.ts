import PaginationRoot from './PaginationRoot.vue';
import PaginationList from './PaginationList.vue';
import PaginationItems from './PaginationItems.vue';
import PaginationItem from './PaginationItem.vue';
import PaginationEllipsis from './PaginationEllipsis.vue';
import PaginationPrevious from './PaginationPrevious.vue';
import PaginationNext from './PaginationNext.vue';

export const Pagination = {
	Root: PaginationRoot,
	List: PaginationList,
	Items: PaginationItems,
	Item: PaginationItem,
	Ellipsis: PaginationEllipsis,
	Previous: PaginationPrevious,
	Next: PaginationNext,
};

export type {
	PaginationRootProps,
	PaginationListProps,
	PaginationItemProps,
	PaginationButtonProps,
	PaginationEllipsisProps,
	PaginationItemValue,
} from './Pagination.types';
