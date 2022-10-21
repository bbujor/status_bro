import { Skeleton } from "@mantine/core";
import React, { ReactElement } from "react";

const showSkeleton = (): ReactElement =>
    <>
        {[0,1,2,3,4,5,6,7].map(val => <tr key={`loader${val}`}>
            <td colSpan={12}>
                <Skeleton height="2em" width="100%" p="0" />
            </td>
        </tr>)}
    </>

export default showSkeleton