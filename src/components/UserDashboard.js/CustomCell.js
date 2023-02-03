const CustomStatusCell = ({ value }) => {

    return (
        <div className="custom-cell">
            <span className={`badge rounded-pill w-100 text-bg-${value == "online" ? "success" : "danger"}`}>
                {value}
            </span>
        </div>
    )
}

export default CustomStatusCell;
