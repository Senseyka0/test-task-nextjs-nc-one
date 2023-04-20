import { useEffect, useState } from "react";
import {
  Cell,
  Column,
  Heading,
  Row,
  TableBody,
  TableHeader,
  TableView,
  useAsyncList,
  useCollator,
} from "@adobe/react-spectrum";

import { api } from "@/api";
import { useWindowWidth } from "@/hooks/useWindowWidth";
import usePagination from "@/hooks/usePagination";
import { pageSize } from "@/constants";
import { getPeople } from "@/api/people";

import EditorModal from "../EditorModal";
import Pagination from "../Pagination";

enum ColumnKeys {
  STUDENT = "student",
  COURSE = "course",
  MODULE = "module",
  LESSON = "lesson",
  PROGRESS = "progress",
  ACTION = "action",
}

type Ikey =
  | ColumnKeys.STUDENT
  | ColumnKeys.COURSE
  | ColumnKeys.PROGRESS
  | ColumnKeys.MODULE
  | ColumnKeys.LESSON;

export interface Character {
  id: number;
  student: string;
  course: string;
  module: string;
  lesson: string;
  progress: string;
}

const columnsData = [
  { id: 1, name: ColumnKeys.STUDENT },
  { id: 2, name: ColumnKeys.COURSE },
  { id: 3, name: ColumnKeys.MODULE },
  { id: 4, name: ColumnKeys.LESSON },
  { id: 5, name: ColumnKeys.PROGRESS },
  { id: 6, name: ColumnKeys.ACTION },
];

const AsyncSortTable = () => {
  const { isMobileAndTablet } = useWindowWidth();

  const [peopleLength, setPeopleLength] = useState<number>(0);
  const [error, setError] = useState();

  const { totalPages, setPage, page, prevPage, nextPage } = usePagination({
    contentPerPage: pageSize,
    count: peopleLength,
  });

  let collator = useCollator({ numeric: true });

  const DESCENDING = "descending";

  const list = useAsyncList<Character>({
    async load({ signal }) {
      const res = await api({
        method: "GET",
        url: `/people?_page=${page}&_limit=5`,
        data: {
          signal,
        },
      });
      const json = await res.data;

      return {
        items: json,
      };
    },
    async sort({ items, sortDescriptor }) {
      return {
        items: items.sort((a: Character, b: Character) => {
          if (sortDescriptor.column) {
            // @ts-ignore
            const first = a[sortDescriptor.column];
            // @ts-ignore
            const second = b[sortDescriptor.column];
            let cmp = collator.compare(first, second);

            if (sortDescriptor.direction === DESCENDING) {
              cmp *= -1;
            }
            return cmp;
          }
          return 0;
        }),
      };
    },
  });

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await getPeople();

        setPeopleLength(data.length);
      } catch (e: any) {
        setError(e.message);
      }
    };

    fetch();
  }, []);

  useEffect(() => {
    list.reload();
  }, [page]);

  return (
    <>
      <TableView
        aria-label="Example table with client side sorting"
        sortDescriptor={list.sortDescriptor}
        onSortChange={list.sort}
        density={isMobileAndTablet ? "compact" : "spacious"}
        width="100%"
      >
        <TableHeader>
          {columnsData.map((item) => (
            <Column key={item.name} allowsSorting minWidth={110}>
              {item.name}
            </Column>
          ))}
        </TableHeader>
        <TableBody
          items={list.items}
          loadingState={list.loadingState}
          onLoadMore={list.loadMore}
        >
          {(item) => (
            <Row key={item.id}>
              {(columnKey) => {
                if (columnKey === ColumnKeys.ACTION) {
                  return (
                    <Cell>
                      <EditorModal item={item} list={list} />
                    </Cell>
                  );
                } else {
                  return <Cell>{item[columnKey as Ikey]}</Cell>;
                }
              }}
            </Row>
          )}
        </TableBody>
      </TableView>

      <div>
        {error && <Heading>{error}</Heading>}

        <Pagination
          changePage={setPage}
          currentPage={page}
          totalPages={totalPages}
          nextPage={nextPage}
          prevPage={prevPage}
        />
      </div>
    </>
  );
};

export default AsyncSortTable;
