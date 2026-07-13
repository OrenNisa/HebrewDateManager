// const ProducrCard = ({ name, price, inStock }) => (
//   <div>
//     <p>
//       {name}: {price}$
//     </p>
//     <p>{inStock ? "In stock" : "Out of stock"}</p>
//   </div>
// );

import { useState } from "react";

// const LikeButton = () => {
//   const [likes, setLikes] = useState(0);

//   return (
//     <div>
//       <p>Numbers of likes: {likes}</p>
//       <button onClick={() => setLikes((prevLikes) => prevLikes + 1)}>+1</button>
//     </div>
//   );
// };

const SimpleTodo = () => {
  const [task, setTask] = useState(null);
  return (
    <div>
      <input value={task} onChange={(e) => setTask(e.target.value)}></input>
    </div>
  );
};
