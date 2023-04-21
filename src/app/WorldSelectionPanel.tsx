export function WorldSelectionPanel({
    ...props
}) {

    const list = [1,2,3,4,5,6,7,8,9,10];

    return <div
        css={[{
            background: "#000000b0",
            border: "1px solid #ffffffb0",
        }]}
        {...props}
    >
        WorldSelectionPanel 
        <ul> {list.map( (i)=><li>{i}</li>)}</ul>
    </div>;
}