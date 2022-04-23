// props have to be in an object ({ category})
const CategoryList = ({ category }) => {
  return (
    <>
      <option value={category.id}>{category.name}</option>
    </>
  );
};

export default CategoryList;
