import clsx from "clsx";

import classes from "./pagination.module.scss";
interface Props {
	currentPage: number;
	changePage(num: number): void;
	totalPages: number;
	nextPage(): void;
	prevPage(): void;
}

const Pagination = (props: Props) => {
	const { totalPages, currentPage, changePage, nextPage, prevPage } = props;

	return (
		<div className={classes.wrapperPagination}>
			<button onClick={prevPage} className={clsx(classes.page, classes.pageButton)}>
				&larr;
			</button>

			<ul className={classes.wrapperList}>
				{[...Array(totalPages).keys()].map((page: number) => (
					<li
						key={page}
						onClick={() => changePage(page + 1)}
						className={clsx(classes.page, {
							[classes.selected]: page + 1 === currentPage,
						})}
					>
						{page + 1}
					</li>
				))}
			</ul>

			<button onClick={nextPage} className={clsx(classes.page, classes.pageButton)}>
				&rarr;
			</button>
		</div>
	);
};

export default Pagination;
