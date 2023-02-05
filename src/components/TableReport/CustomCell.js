const CustomCell = ({ value }) => {
    const arr = value.split(',');
    const color = ['success', 'warning', 'danger', 'primary', 'secondary', 'info', 'light', 'dark']
    const colors = ['#2F4F4F', '#708090', '#778899', '#696969', '#808080', '#979797', '#A9A9A9', '#C0C0C0', '#D3D3D3']

    return (
        <div className="custom-cell">
            {
                arr.map((item, index) => (
                    <>
                    <span className={`badge rounded-pill w-100`} style={{ backgroundColor: colors[index] }}>
                        {item}
                    </span>
                    <br />
                    </>
                ))
            }
        </div>
    )
}

export default CustomCell;
