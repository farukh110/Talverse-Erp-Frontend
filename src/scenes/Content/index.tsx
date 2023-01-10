import React, { useEffect } from 'react';
import { ContentRequestDto } from '../../services/Content/dto/contentRequestDto';
import { useAppStores, useCompState } from '../../hooks/appStoreHooks';
import { Badge, Card, List } from 'antd';
import './index.less'
import { Link } from 'react-router-dom';
import { CustomCol, CustomRow } from '../../components/CustomControls';

const AllContent = (props: any) => {

    const { contentStore } = useAppStores();
    const [compData, setCompData] = useCompState([]);

    const onLoad = async () => {

        let requestObj: ContentRequestDto = {
            ComponentIdOrName: 'AllTablesWithCount',
            Parameters: []
        }

        let comp = await contentStore.GetComponentData(requestObj);

        console.log("Found", comp)

        if (comp && comp.items) {
            console.log("Found")
            setCompData(comp.items);
        }
    }

    useEffect(() => {
        onLoad();
    }, []);

    return (
        <>
            <div className="all-content-wrapper">
                <Card className='card-grid'>
                    {/* <List
                        itemLayout="horizontal"
                        dataSource={compData}
                        renderItem={(item: any, index: number) => (
                            <List.Item>
                                <List.Item.Meta
                                    avatar={index + 1}
                                    title={<>
                                        <Link className="item-link" to={`/content?q=${item.tableName}`}>{item.tableName}</Link>
                                        <Badge className="badge-green" count={`${item.rowCount} records`} showZero={true} size="default">
                                        </Badge>
                                    </>
                                    }
                                    description={`Data store and management related to "${item.tableName}""`}
                                />
                            </List.Item>
                        )}
                    /> */}

                    <CustomRow gutter={[16, 16]}>

                        {
                            compData.map((itemCol: any, index: any) => (

                                <CustomCol key={index} span={6}>
                                    <Link className="item-link" to={`/administration/allcontent/content?q=${itemCol.tableName}`}>
                                        <div className="column-view">

                                            <CustomRow>

                                                <CustomCol span={12}>

                                                    <h4> {itemCol.tableName} </h4>

                                                </CustomCol>

                                                <CustomCol span={12}>

                                                    <Badge className="badge-green" count={`${itemCol.rowCount} records`} showZero={true} size="default">
                                                    </Badge>

                                                </CustomCol>


                                            </CustomRow>
                                            
                                            <p> {`Data store and management related to "${itemCol.tableName.replace(/([a-z])([A-Z])/g, '$1 $2')}""`} </p>

                                        </div>
                                    </Link>
                                </CustomCol>


                            ))
                        }

                    </CustomRow>

                </Card>
            </div>
        </>
    )
}

export default AllContent;
