export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-2xl font-bold text-primary-foreground">
            T
          </div>
          <h1 className="text-2xl font-bold">팀메이트</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            가벼운 그룹웨어, 업무 효율성 향상
          </p>
        </div>
        {children}
      </div>
    </div>
  )
}
