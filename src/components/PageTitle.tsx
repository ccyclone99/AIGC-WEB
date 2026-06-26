type PageTitleProps = {
  eyebrow: string
  text: string
  title: string
}

export function PageTitle({ eyebrow, text, title }: PageTitleProps) {
  return (
    <section className="page-title">
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p>{text}</p>
    </section>
  )
}
