type Props = {
    children: React.ReactNode;
}

const LessonLayout = ({children}: Props) => {
  return (
        <div className="flex flex-col min-h-screen w-full bg-background">
            {children}
        </div>
  )
}

export default LessonLayout