import { ReactNode } from "react";
import styles from "./Piece.module.css";
import black_ from '../../imgs/black_.png';
import white_ from '../../imgs/white_.png';
type Props = {
  color: string;
  border: string;
  children: ReactNode;
};

export default function Piece(props: Props) {
  const imageSource = props.color === "White" ? white_ : black_;
  return (
    <div
      className={styles.piece}
      style={{
        background: props.color !== "White" ? "black" : "#f8f7f3",
      
        color: props.color === "White" ? "black" : "#f8f7f3",
      }}
      {...props}
    >
      <img src={imageSource} alt="" height={'100%'} width={'100%'}/>
      </div>
  );
}
