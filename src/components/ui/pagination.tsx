import React from "react";
import Link from "next/link";
import { Button } from "./button";

interface PaginationProps {
  page: number;
  totalPages: number;
}

export function Pagination({ page, totalPages }: PaginationProps) {
  return (
    <nav className="flex justify-center space-x-2" aria-label="Pagination">
      {page > 1 && (
        <Link href={`?page=${page - 1}`} passHref>
          <Button variant="outline">Previous</Button>
        </Link>
      )}
      <span>
        Page {page} of {totalPages}
      </span>
      {page < totalPages && (
        <Link href={`?page=${page + 1}`} passHref>
          <Button variant="outline">Next</Button>
        </Link>
      )}
    </nav>
  );
}
