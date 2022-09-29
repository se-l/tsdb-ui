import { Rnd } from "react-rnd";

export default function DragResize({ children }: { children: JSX.Element }) {
    return (
        <Rnd>
            <div style={{ borderStyle: "dotted", height: "100%", width: "100%" }}>{children}</div>
        </Rnd>
    )
}