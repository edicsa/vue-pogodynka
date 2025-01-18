
export const getData = ( name ) =>
{
  return localStorage.getItem( name );
};

export const getParsedData = ( name ): any =>
{

  console.log( "getParsedData: ", name, JSON.parse( String( getData( name ) ) ) );


  return JSON.parse( String( getData( name ) ) );
};

export const setdata = ( name, value ) =>
{
  localStorage.setItem( name, JSON.stringify( value ) );

  console.log( "setdata: ", name, value );

};

export default getData;