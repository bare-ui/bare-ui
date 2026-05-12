import CalendarRoot from './CalendarRoot.vue';
import CalendarNav from './CalendarNav.vue';
import CalendarPrevButton from './CalendarPrevButton.vue';
import CalendarNextButton from './CalendarNextButton.vue';
import CalendarTitle from './CalendarTitle.vue';
import CalendarGrid from './CalendarGrid.vue';

export const Calendar = {
	Root: CalendarRoot,
	Nav: CalendarNav,
	PrevButton: CalendarPrevButton,
	NextButton: CalendarNextButton,
	Title: CalendarTitle,
	Grid: CalendarGrid,
};

export type {
	CalendarRootProps,
	CalendarNavProps,
	CalendarPrevButtonProps,
	CalendarNextButtonProps,
	CalendarTitleProps,
	CalendarGridProps,
	CalendarDay,
	CalendarWeekday,
	WeekStart,
} from './Calendar.types';
