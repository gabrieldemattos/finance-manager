interface TitleProps {
  title: string;
  description: string;
}
const Title = ({ title, description }: TitleProps) => {
  return (
    <div className="flex flex-col items-center gap-2 px-5">
      <p className="text-2xl font-bold">{title}</p>
      <p className="text-center text-lg text-gray-500 text-opacity-80">
        {description}
      </p>
    </div>
  );
};

export default Title;
