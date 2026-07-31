import s from '../pagination.module.css'
import {getPaginationPages} from "../utilts/getPaginationPages";
import {SIBLING_COUNT} from "./constants";

type Props = {
    current: number
    pagesCount: number
    onChange: (page: number) => void
}





export const PaginationNav = ({ current, pagesCount, onChange }: Props) => {
    const pages = getPaginationPages(current, pagesCount, SIBLING_COUNT)

    return (
        <div className={s.pagination}>
            {pages.map((item, idx) =>
                    item === "..." ? (
                        <span className={s.ellipsis} key={`ellipsis-${idx}`}>
            ...
          </span>
                    ) : (
                        <button
                            key={item}
                            className={item === current ? `${s.pageButton} ${s.pageButtonActive}` : s.pageButton}
                            onClick={() => item !== current && onChange(Number(item))}
                            disabled={item === current}
                            type="button"
                        >
                            {item}
                        </button>
                    ),
            )}
        </div>
    )
}