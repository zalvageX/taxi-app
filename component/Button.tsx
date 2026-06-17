import Image from "next/image";

type ButtonProps = {
    type: "button" | "submit";
    title: string;
    icon?: React.ReactNode | string;
    variant?: "primary" | "secondary";
}   

const Button = ({ type, title, icon, variant }: ButtonProps) => {
  return (
    <button 
        type={type}
    >    
      {icon && <Image src="icon" alt={title} width={24} height={24} />}
      {/* {icon && <span className="icon">{icon}</span>} */}
      <label>{title}</label>
      
    </button>
  )
}

export default Button