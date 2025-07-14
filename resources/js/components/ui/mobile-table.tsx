import * as React from "react"
import { cn } from "@/lib/utils"

function MobileTable({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="mobile-table"
      className={cn("space-y-4 sm:hidden", className)}
      {...props}
    />
  )
}

function MobileTableHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="mobile-table-header"
      className={cn("text-xs text-muted-foreground uppercase font-semibold tracking-wider px-4", className)}
      {...props}
    />
  )
}

function MobileTableBody({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div data-slot="mobile-table-body" className={cn("space-y-4", className)} {...props} />
  )
}

function MobileTableFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="mobile-table-footer"
      className={cn("border-t pt-2 mt-4 text-sm text-muted-foreground px-4", className)}
      {...props}
    />
  )
}

function MobileTableRow({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="mobile-table-row"
      className={cn("border rounded-lg shadow-sm px-4 py-3", className)}
      {...props}
    />
  )
}

function MobileTableCell({
  label,
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { label: string }) {
  return (
    <div
      data-slot="mobile-table-cell"
      className={cn("flex items-start justify-between py-1 text-sm", className)}
      {...props}
    >
      <span className="font-medium text-muted-foreground">{label}</span>
      <span className="text-right max-w-[60%] truncate">{children ?? "--"}</span>
    </div>
  )
}

function MobileTableCaption({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="mobile-table-caption"
      className={cn("text-muted-foreground text-sm px-4 mt-2", className)}
      {...props}
    />
  )
}

export {
  MobileTable,
  MobileTableHeader,
  MobileTableBody,
  MobileTableFooter,
  MobileTableRow,
  MobileTableCell,
  MobileTableCaption,
}
